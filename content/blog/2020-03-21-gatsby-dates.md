---
slug: gatsby-dates
title: Using Dates in Gatsby
tags:
- gatsby
- date
- git
---
With [Pi Day](https://www.piday.org) having just past last week, we're here to talk about dates in Gatsby.
![alt text](../assets/pi-day.jpg "Pi Day. Errr day.")

There are a couple of ways you can date your posts in Gatsby. We'll discuss the easiest
method and two others that are more dynamic to deliver a more "wordpress" feel to managing
a blogging experience.

## Static dates
The easiest method is to manually define the post date in the markdown header bit.
```markdown
slug: gatsby-dates
date: 2020-03-21T06:13:46.040Z // highlight-line
title: Using Dates in Gatsby
tags:
- gatsby
- date
```

Extracting this field is the same as extracting any other header field from GraphQL.
```graphql
query BlogPostBySlug($slug: String!) {
  ...
  markdownRemark(fields: { slug: { eq: $slug } }) {
    ...
    frontmatter {
      title
      date // highlight-line
      tags
    }
  }
}
```

Rendering is pretty standard, aside from using `moment` to format the dates.
```javascript
import moment from "moment" // highlight-line
...

const BlogPostTemplate = ({ data, location }) => {
  ...
  const { title, date, tags } = data.markdownRemark.frontmatter // highlight-line
  const { html } = data.markdownRemark

  return (
    <Layout location={location} title={title}>
      <article>
        <header>
          <h2>{title}</h2>
          <p>{moment(date).format("MMM Do YYYY, h:mma")}</p> // highlight-line
        </header>
        <section dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </Layout>
  )
}
```

So far so good, this approach gives you complete control over the exact dates for each
post. However, not everyone is a fan of having to manually enter dates for each post.

## Dynamic dates using git commits
The most obvious dynamic way to derive a post's date is by the date when the file was
modified. Unfortunately, this isn't preserved very well when transporting files between
the computer where the post was authored, the code repository and the deployment platform.
The one consistent date between the three are commit dates when the post file was added
and you can derive that using the git command:
```bash
git log -1 --pretty=format:%aI /path/to/file
```

That gets you the most recent commit for the file specfied in ISO 8601 date format. Now,
that command needs to be run when post pages are created, so add the following into
`gatsby-node.js`, which creates a new field called `gitTime`.
```javascript
exports.onCreateNode = ({ node, actions, getNode }) => {
  ...
  const fileName = node.fields.slug.replace(/\//g, '')
  const relativePath = `content/blog/${fileName}.md`
  const gitTime = execSync(
    `git log -1 --pretty=format:%aI ${relativePath}`
  ).toString()

  actions.createNodeField({
    name: `gitTime`,
    node,
    value: gitTime,
  })
}
```
The GraphQL query should then extract from `fields` instead of `frontmatter`.
```graphql
query BlogPostBySlug($slug: String!) {
  ...
  markdownRemark(fields: { slug: { eq: $slug } }) {
    ...
    fields {
      gitTime // highlight-line
    }
    frontmatter {
      title
      tags
    }
  }
}
```
Rendering is the same as in the previous example, again substituting `frontmatter` for `fields`.
```javascript
const { gitTime } = data.markdownRemark.fields
```

I faced two issues with this approach that might not apply to everyone. First was that
when deploying via zeit, the `.git` directory is not present in the deployment directory,
hence the `git` command cannot pull history. You can work around this by changing your
`build` command in your `package.json` to the following:
```bash
git clone --no-checkout https://github.com/... x && cp -r x/.git . && gatsby build
```
This performs an additional clone of just the `.git` directory and moves it into the
deployment root (git doesn't allow you to checkout to a non-empty directory) before
performing `gatsby build`.

The second issue is more subjective in that I find myself having to make tiny edits to
posts that have already been published. This changes the latest commit date of that file,
which reflects in the blog. The workaround is more drastic in that after performing a
commit, I manually change the commit date to the original post date before pushing. (I'll
write a separate post on git cheats to describe this in due time).

## Dynamic dates using git pre-commit hook
The third method involves using a git hook to automate either the first or second method.
There's a project called
[git-date-extractor](https://github.com/joshuatz/git-date-extractor) that does the hard
work of crawling the directory, extracting the git created/modified dates and caching it
into a file for you. You should read the project docs to find out more on the available
options but here's a sample in CLI mode:
```bash
node_modules/git-date-extractor/src/cli.js --projectRootPath=. --onlyIn=content/blog --outputToFile=true
```

What you then need to do is to run that CLI in a git pre-commit hook by adding it to
`.git/hooks/pre-commit`. The `.git` directory doesn't persist, so if you're using multiple
computers to author posts, commit a new directory (e.g. `.hooks`) and add the CLI into
`.hooks/pre-commit`. On each computer you plan to author on, set up the git hooks path by
running `git config core.hooksPath .hooks`. I chose to run it as a node script as I found
it was writing absolute paths in CLI mode and I needed this to run in different environments.

```javascript
#!/usr/bin/env node
const gitDateExtractor = require('git-date-extractor')
gitDateExtractor.getStamps({
  outputToFile: true,
  projectRootPath: `${__dirname}/../content/blog`,
  gitCommitHook: 'pre'
})
```

My project structure has `content` on the root and blog posts go into `content/blog`, so
this hook creates the `timestamps.json` file in `content/blog`. Setting the
`gitCommitHook` property to `pre` adds the `timestamps.json` file into the same commit.
You will end up with a file that looks like this, a simple object keyed by filename with
created and modified unix timestamps.

```json
{
  "2020-03-21-gatsby-dates.md": {
    "created": 1584785764,
    "modified": 1584858812
  }
}
```

Next, use `gatsby-node.js` to read the `timestamps.json` file and add the gitTime field
with this value instead. Also, fallback to using the real-time git command if the cache
file doesn't exist (i.e. when using `gatsby develop` before the pre-commit hook has run
for the very first time)

```javascript
const fs = require(`fs`)         // highlight-line
const moment = require(`moment`) // highlight-line

const timestampsFile = `${__dirname}/content/blog/timestamps.json` // highlight-line
let timestamps                                                     // highlight-line
if (fs.existsSync(timestampsFile)) {                               // highlight-line
  timestamps = JSON.parse(fs.readFileSync(timestampsFile, 'utf8')) // highlight-line
}                                                                  // highlight-line
...

exports.onCreateNode = ({ node, actions, getNode }) => {
  ...
  let gitTime
  const fileName = node.fields.slug.replace(/\//g, '')

  if (timestamps && timestamps[`${fileName}.md`]) {           // highlight-line
    const timestamp = timestamps[`${fileName}.md`][`created`] // highlight-line
    gitTime = moment.unix(timestamp).format()                 // highlight-line
  }                                                           // highlight-line
  else {
    const relativePath = `content/blog/${fileName}.md`
    gitTime = execSync(
      `git log -1 --pretty=format:%aI ${relativePath}`
    ).toString()
  }
  ...
}
```

This approach solves both of my concerns from the previous method: since the hook runs at
commit-time, there's no dependency on the deployment server to have git history. Also,
since this method captures both created and modified dates, I can choose to use the
created date in the displayed time stamp and make edits as I please without messing with
actual git commit dates.

## Beyond Gatsby
This post wraps up the [#gatsby](/tags/gatsby) series for getting started on building a
tech blog with some of my must-have features like hashtagging, syntax highlighting and
automatic dating. I shall move on to writing about the various disparate topics that
inspired me to start this place to begin with. Stay tuned!
