---
slug: optimise-java-docker-images
title: Optimising Java Docker Images
tags:
- java
- docker
- kubernetes
image: containers.jpg
---
Containers have evolved very quickly from being an obscure technology to being confused
with virtual machines to being mainstream production drivers today. Docker itself has been
around for 7 years but many developers of the old world still do not understand it very
much. This leads to sub-optimal implementations because people are forced to use it and
take the easiest possible approach. In this post, we'll explore how to optimise Docker
images in the context of Java, using a Spring Boot example.

![alt text](../static/containers.jpg "Containers. Photo by Diego Fernandez on Unsplash.")

## Build the app
Let's start by generating a sample app from [start.spring.io](https://start.spring.io).
We'll pick the following options to create a bare bones web app:
- Maven Project
- Spring Boot 2.2.6
- Java 14
- Dependencies: Spring Web

Build the project using `mvn clean package` and you will find a far JAR file weighing
about *17 megabytes*. This standalone, self-executable format was made popular by Spring
Boot since it's convenient to just deploy a single file and ignore app server
dependencies. Developers hate sharing app servers for good reason.

## Create a simple Dockerfile
Within the project, create the simplest `Dockerfile`

```docker
FROM openjdk:14-slim
COPY ./target/*.jar app.jar
ENTRYPOINT [ "java", "-jar", "./app.jar" ]
```

Build the docker image and push it to your image registry.
```bash
docker build -t your-registry/demo .
docker push your-registry/demo
```

You'll notice that it pushes 5 layers ranging from a miniscule *3 kilobytes* to a much
larger *336 megabytes*. That first layer should have a size similar to your far JAR.

```docker
ea2b82629d91: Pushing  0kB /  17.6MB # highlight-line
64dd9292f295: Pushing  0kB / 335.9MB
38ae49ae5249: Pushing  0kB /   3.6kB
2eaf0d58a380: Pushing  0kB /   8.8MB
c2adabaecedb: Pushing  0kB /  69.2MB
```

## Docker layers
Docker works by caching layer data. If the registry already has an identical layer, the
client skips pushing that layer. Thus, building images that reuse layers as much as
possible reduces the net storage and bandwidth usage. If you don't care about that,
it also makes your pushes and pulls faster, which directly translates to app startup time
in the Kubernetes world.

## Why fat JARs are evil
Let's make one tiny change to our code, maybe add a log statement, then rebuild the
project and docker image again and push it.

```docker
aac3c35cde67: Pushing  0kB/ 17.6MB # highlight-line
64dd9292f295: Layer already exists
38ae49ae5249: Layer already exists
2eaf0d58a380: Layer already exists
c2adabaecedb: Layer already exists
```

Hold on.. why did I have to spend time and use another *17.6 megabytes* of bandwidth just
for a single line of code that changed? *Because fat JAR*. While this number doesn't seem
very large by modern standards, it will grow as large as the number of dependencies your
project requires. Imagine the cost of changing a single variable on a *gigabyte-sized*
layer. There are people for whom this scenario needs no imagination.

## Why standard base images are evil
If you do a `docker images|grep demo`, you'll find the image you just built weighs a hefty
*432 megabytes* while your fat JAR only contributed *17*. The rest of that bulk is from
the `openjdk:14-slim` base image (slim being.. relative).

When the Java world finally moved on from Java 8, the concept of *Java modules* was
introduced. It's essentially an abstraction above packages so a module represents a bunch
of packages. Nothing fancy. What's interesting is the introduction of the `jlink` utility,
which lets you generate your own JVM based on what modules you need. This removes all the
unnecessary Java APIs you do not use into a truly *slim* build. This begs the question of
"How do I know which modules I use?", which is answered by the `jdeps` utility which can
analyse your compiled code.

## Optimal strategy
Now that we have the background sorted, let's work out what needs to be done:
1. Write your code and build the far JAR as usual
2. Use `jdeps` to analyse what modules your app requires
3. Build a two-stage `Dockerfile`
4. In Stage 1:
   - Use the standard JDK base image
   - Run `jlink` to build an optimised JVM
   - Unpack the far JAR
   - Organise the unpacked artifacts between dependencies and app code
5. In Stage 2:
   - Use a tiny base image
   - Move the optimised JVM over
   - Move the unpacked dependencies over
   - Move the app code over
   - Launch your main class using the optimised JVM

## In practice: module dependency analysis
After building your fat JAR, unpack it and run `jdeps` on recursive mode against the
dependencies and the JAR itself. Some dependencies like `log4j-api` are multi-release so
you might need to specify a release number based on your JDK. We're using 14 here.
```bash
$ mkdir analysis && cd $_
$ cp ../target/*.jar x.jar && jar -xf x.jar
$ jdeps -s --multi-release=14 --recursive -cp BOOT-INF/lib/* x.jar

classmate-1.5.1.jar -> java.base
com.fasterxml.jackson.annotation -> java.base
com.fasterxml.jackson.core -> java.base
com.fasterxml.jackson.databind -> com.fasterxml.jackson.annotation
...
```

This gives you a giant map of which dependency needs which module, which are granular
details we're not interested in. What we need is a comma-separated list of module names to
feed our `jlink` command later. A bit of shell pipe magic should do.

```bash
$ jdeps -s --multi-release=14 --recursive -cp BOOT-INF/lib/* x.jar \
|cut -d ' ' -f3|sort|uniq|grep '^j'|paste -s -d, -

java.base,java.desktop,java.instrument,java.logging,java.management,java.management.rmi,java.naming,java.prefs,java.rmi,java.scripting,java.security.jgss,java.sql,java.xml,jdk8internals,jdk.httpserver,jdk.unsupported
```

Much better. We'll save that list for later.

## In practice: multi-stage Docker build
Using the same JDK base image for stage 1, we run `jlink`, feeding in the modules list
from the previous step and specifying an output directory in `/jvm`. We then move the fat
JAR over, unpack it and create a `/app` directory to group metadata and app code
(`META-INF` and `BOOT-INF/classes`). Dependencies remain in `BOOT-INF/lib`.

In stage 2, we use a tiny base image `debian:stretch-slim` and use 3 `COPY` statements to
divide these parts into separate layers: the JVM, the dependencies and the app code. We
then launch the app using the JVM, including the dependencies in the classpath.

```docker
FROM openjdk:14-slim
RUN jlink --output /jvm --no-header-files --no-man-pages --compress=2 \
--strip-debug --add-modules java.base,java.desktop,jdk8internals,\
java.instrument,java.logging,java.management,java.management.rmi,\
java.naming,java.prefs,java.rmi,java.scripting,java.security.jgss,\
java.sql,java.xml,jdk.httpserver,jdk.unsupported
WORKDIR /build
COPY ./target/*.jar app.jar
RUN jar -xf app.jar
RUN mkdir /app && cp -r META-INF /app && cp -r BOOT-INF/classes/* /app

FROM debian:stretch-slim
COPY --from=0 /jvm /jvm
COPY --from=0 /build/BOOT-INF/lib /lib
COPY --from=0 /app .
ENTRYPOINT [ "/jvm/bin/java", "-cp", ".:/lib/*", "com.example.demo.DemoApplication" ]
```

At this point, you might encounter some failures running `docker build` due to the
`jlink` command. There are two common things that can happen. First is that `jdeps`
doesn't give you a definitive set of modules so you might see a `not found` error like the
one below. Simply remove the offending module from the `--add-modules` list.

```bash
Error: Module jdk8internals not found
```

Second thing that can happen is if you picked a stage 1 image that doesn't have `objcopy`
installed. To fix, simply swap out the `--strip-debug` argument for the alternative
`--strip-java-debug-attributes` instead.
```bash
Error: java.io.IOException: Cannot run program "objcopy": error=2, No such file or directory
```

## What has changed?
In the *change a variable* test, only *12 kilobytes* needed to move. That's like a 99%
reduction in bandwidth and a negligible amount of time needed to push the image.
```bash
7c76a9957d46: Pushing  0kB / 12.29kB # highlight-line
cfa161abfacf: Pushing  0kB / 17.51MB
27eda33d0eae: Pushing  0kB / 50.26MB
cde96efde55e: Pushing  0kB / 55.32MB
```

```bash
e7c728ed739b: Pushing  0kB / 12.29kB # highlight-line
cfa161abfacf: Layer already exists
27eda33d0eae: Layer already exists
cde96efde55e: Layer already exists
```

As a whole, it was a 71% reduction in total image size as a baseline
```bash
$ docker images|grep demo
registry/demo  before  a90ae7133e69  2 hours ago    432MB
registry/demo  after   5165c278494d  2 minutes ago  123MB # highlight-line
```

*Way, way faster.*

## Caveats
As you've noticed,`jdeps` is not *fool-proof*. I've experienced a couple of scenarios
where the build process succeeds, only to fail at runtime due to a missing module. Hence,
you will need to test your app end-to-end to ensure that your optimised image is complete.
These are some common modules to add if your app does the following:
- `jdk.crypto.ec`: If your app calls third-party REST APIs (that might use elliptic curve
  cryptography in their TLS certificates)
- `jdk.naming.dns`: If your app connects to mongodb using `mongodb+srv://`

Also, I've yet to find a good setup for ARM builds so the above is really more suitable
for x86 images.

## The future..
is hard to tell. Container technology moves so fast that this technique might become
obsolete pretty quickly. The dream is that it's something that happens automagically in a
stable form. Did I miss out on any tips? Do drop me an @mention or DM.
