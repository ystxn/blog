---
templateKey: blog-post
slug: hello-world
title: Hello World
date: "2020-03-11T14:27"
tags:
- gatsby
---
First post! Trying out the [gatsby](https://www.gatsbyjs.org/)
static site generator to see what the fuss is all about.

```javascript
const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const tags = post.frontmatter.tags || []
  const tagsList = tags.map(t => (
      <Link to={`/tags/${t.replace(/ /g, '-')}`}>#{t}</Link>
  )).reduce((prev, curr) => [prev, ', ', curr])
})
```
