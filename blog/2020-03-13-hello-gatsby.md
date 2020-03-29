---
slug: hello-gatsby
title: Building a Gatsby Blog
tags:
- gatsby
image: mando-blog-meme.jpg
---
First post! Trying out the [Gatsby](https://www.gatsbyjs.org/) static site generator to
see what the fuss is all about (and building out this site at the same time).

![alt text](../static/mando-blog-meme.jpg "This is the way.")

## What is a static site generator?
It's essentially a dynamic site at develop-time transformed into a static site during the
build process. There are a whole bunch of SSGs out there and Gatsby seems to be quite
popular so I'm giving it a shot. Gatsby allows you to back the site from various *actual*
backends like wordpress but I'm keeping it static by writing posts in regular markdown
files.

## In a nutshell
1. Install the Gatsby CLI
2. Use the Gatsby CLI to generate a project
3. Use the CLI to serve a live-reload preview locally
4. Tinker with the templates/plugins etc till you're happy
5. Use the CLI to build the production site
6. Deploy it to any static host. No dynamic runtime/database required.

## How does it work?
From a user's perspective, Gatsby is just a couple of configuration files and an entire
ecosystem of plugins. Understanding the code and making your own customisations involves
having a working know-how of React and GraphQL, which Gatsby uses as a query mechanism to
get site and post data into pages (which are React components). Let's walk through some of
the core structure in the context of building this blog.

### Configuration files
* `gatsby-config.js`: the core config file. all plugins need to be registered here along
                      with their respective properties
* `gatsby-node.js`: config for the build process that generates the static output
* `gatsby-browser.js`: for global imports (typefaces etc)

### Plugins
* `gatsby-source-filesystem`: reads static files from disk (markdown, images etc)
* `gatsby-transformer-remark`: converts markdown into html. has many sub-plugins that
                               further customise how this process works.
* `gatsby-plugin-manifest`: creates manifest to qualify as a
                            [progressive web app](https://web.dev/progressive-web-apps)
* `gatsby-plugin-react-helmet`: adds metadata for search engine optimisation
* `gatsby-remark-prismjs`: adds syntax-highlighting for `<code/>` blocks

There are many more plugins you can add and it's mostly a simple process of performing
`npm install` then adding it into `gatsby-config.js`

## Get started
First, install the Gatsby CLI:
```bash
npm install -g gatsby-cli
```
Next, generate a new project. Gatsby uses a concept called *starters* that are basically
example project scaffolds to create many different types of sites. I'm creating a blog
here so I'll use gatsby-starter-blog.
```bash
gatsby new my-blog https://github.com/gatsbyjs/gatsby-starter-blog
```
That's the bare minimum you need - your blog is ready to go. Test your site by serving it
on Gatsby's live reload server.
```bash
gatsby develop
```
Your site is now being served on `http://localhost:8000` and will live reload whenever you
make changes to content or design. Once you're ready to publish your blog to the greater
interwebs, use the CLI to generate a production site.
```bash
gatsby build
```
The production site is generated in the `public` folder, ready for you to upload to any
static web host.

### Relevant irrelevant aside
If you haven't already heard of [zeit.co](https://zeit.co)'s service `now`, it's a pretty
neat service where you sign up for an account, install their `now` CLI, then go into any
directory and type `now`, which instantly uploads the contents of that directory. It then
gives you a website URL where your contents are hosted on, including a SSL/TLS
certificate managed by Let's Encrypt. You can replace the contents of that website at any
time by firing `now` again.

## Making deployments easier
Nobody wants to always have a command shell on hand just to write new blog posts. The idea
of Gatsby is such that you only need the CLI when you make changes to configuration or
design and test the results quickly. Once everything is set up, you should have an
automated CI/CD process so you can literally use github.com's website to author new posts.

All the code for this blog sits in a github repository and linked to a project set up on
`zeit`. On top of the simple static hosting service, `zeit` recognises a bunch of SSGs,
including Gatsby, meaning it will perform the build step for you. It can also integrate
with code repositories like github and sets up the auto-deploy webhook for you.

So everytime a commit is pushed to my master branch (you can choose others), zeit launches
a build and deploys the site automatically. I've also added my custom domain to zeit (just
add a cname dns record) and it handles the Let's Encrypt certificate for me.

## More tinkering
There are lots of stuff you can tinker with in Gatsby and I'll get to them over a couple
more posts. happy blogging!
