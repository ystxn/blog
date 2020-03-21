---
slug: gatsby-dates
title: Using Dates in Gatsby
tags:
- gatsby
- date
draft: true
---
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
      date(formatString: "MMM Do YYYY, h:mma") // highlight-line
      tags
    }
  }
}
```

Rendering is the same as well.
```javascript
const BlogPostTemplate = ({ data, location }) => {
  ...
  const { title, date } = data.markdownRemark.frontmatter // highlight-line
  const { html } = data.markdownRemark

  return (
    <Layout location={location} title={title}>
      <article>
        <header>
          <h2>{title}</h2>
          <p>{date}</p> // highlight-line
        </header>
        <section dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </Layout>
  )
}
```

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
  ).toString().replace(/\+08:00/g, 'Z')

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
      gitTime(formatString: "MMM Do YYYY, h:mma") // highlight-line
    }
    frontmatter {
      title
      tags
    }
  }
}
```
Rendering is the same as in the previous example, again just substituting `fields` from
`frontmatter`.
```javascript
const { gitTime } = data.markdownRemark.fields
```

This is the method I'm using to date the posts in this blog, but i've noticed two issues
thus far. First is that when deploying via zeit, the `.git` directory is not present in
the deployment directory, hence the `git` command cannot pull history. You can work around
this by changing your `build` command in your `package.json` to the following:
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

## Dynamic dates using git pre-commit hooks
The third method involves using git to automate the first method.
