---
templateKey: blog-post
slug: gatsby-tags
title: 'Add #hashtagging to Gatsby'
tags:
- gatsby
- react
- hashtag
---
Following the [previous post](/hello-gatsby) on bootstrapping a bare basics Gatsby blog,
let's explore adding hashtag functionality to make it feel less static. You can add any
metadata you like to the markdown header bits of your posts and query them later using
GraphQL to create a sense of data-driven dynamics. In this post, we'll look at using this
to [#hashtag](/tags/hashtag)-enable your blog.

![alt text](../assets/hashtag.jpg "Hashtags. Photo by Jan Baborák on Unsplash.")

## Step 1. Add tags to individual markdown posts
```markdown
title: 'Add #hashtagging to Gatsby'
slug: gatsby-tags
tags:     // highlight-line
- gatsby  // highlight-line
- react   // highlight-line
- hashtag // highlight-line
```

## Step 2. Revise the templates to display the list of tags on each post
* The files are `templates/blog-post.js` and optionally, `pages/index.js`
* First, extract the `tags` field in the GraphQL query
```javascript
    query BlogPostBySlug($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            ...
            frontmatter {
                title
                tags // highlight-line
            }
        }
    }
```
* Then format it nicely however you like it..
```javascript
    const tags = post.frontmatter.tags || []
    const tagsList = tags.map(tag => (
        <Link key={tag} to={`/tags/${tag}`}>#{tag}</Link>
    )).reduce((prev, curr) => [prev, ', ', curr])
```
* and insert into your template
```html
    <article>
        <header>
            <h2>{post.frontmatter.title}</h2>
            <p>{date}</p>
            <p>{tagsList}</p> <!-- highlight-line -->
        </header>
        <section ...>
    </article>
```

## Step 3. Add a tags listing page to display all tags and their number of posts
* Create this file at `pages/tags.js`
```javascript
    import React from "react"
    import { Link, graphql } from "gatsby"
    import Layout from "../components/layout"
    import SEO from "../components/seo"

    export default ({ data, location }) => {
        const { title } = data.site.siteMetadata
        const tags = data.allMarkdownRemark.group.map(group =>
            const tag = group.fieldValue
            return (
                <li key={tag}>
                    <Link key={tag} to={`/tags/${tag}/`}>
                        #{tag}
                    </Link>
                    {` (${group.totalCount})`}
                </li>
            )
        )

        return (
            <Layout location={location} title={title}>
                <SEO title="Tags" />
                <div>
                    <h2>Tags</h2>
                    <ul>{tags}</ul>
                </div>
            </Layout>
        )
    }

    export const pageQuery = graphql`
        query {
            site {
                siteMetadata {
                    title
                }
            }
            allMarkdownRemark(limit: 2000) {
                group(field: frontmatter___tags) {
                    fieldValue
                    totalCount
                }
            }
        }
    `
```

## Step 4. Define what the per-tag post listing page looks like
* Create this file at `templates/tags.js`
```javascript
    import React from "react"
    import { Link, graphql } from "gatsby"
    import Layout from "../components/layout"
    import SEO from "../components/seo"

    export default ({ pageContext, data, location }) => {
        const { title } = data.site.siteMetadata
        const pageTitle = `#${pageContext.tag} posts`
        const { edges, totalCount } = data.allMarkdownRemark
        const posts = edges.map(
            ({ node: { frontmatter: { title, slug } } }) =>
                <li key={slug}>
                    <Link to={`/${slug}`}>{title}</Link>
                </li>
        )
        return (
            <Layout location={location} title={title}>
                <SEO title={pageTitle} />
                <h2>{pageTitle} ({totalCount})</h2>
                <ul>{posts}</ul>
            </Layout>
        )
    }

    export const pageQuery = graphql`
        query($tag: String) {
            site {
                siteMetadata {
                    title
                }
            }
            allMarkdownRemark(
                filter: {
                    frontmatter: { tags: { in: [$tag] } }
                }
                sort: { fields: [fields___slug], order: DESC }
            ) {
                totalCount
                edges {
                    node {
                        frontmatter {
                            title
                            slug
                        }
                    }
                }
            }
        }
    `
```

## 5. Generate the per-tag pages to display all posts under each tag
* Edit `gatsby-node.js`
* First, collate the tags in the existing logic traversing pages
```javascript
    let tags = [] // highlight-line
    const posts = result.data.allMarkdownRemark.edges
    posts.forEach((post, index) => {
        if (post.node.frontmatter.tags) { // highlight-line
            tags = tags.concat(post.node.frontmatter.tags) // highlight-line
        } // highlight-line
        ...
    })
```
* Then, create the tag pages after the post pages
```javascript
    const tagTemplate = path.resolve("src/templates/tags.js")
    tags.filter((elem, pos, arr) => arr.indexOf(elem) === pos)
        .forEach(tag => {
            createPage({
                path: `/tags/${tag}/`,
                component: tagTemplate,
                context: { tag },
            })
        })
```

## Let there be #tags
Your blog is now organised by tags while remaining blazing fast. Gatsby pre-generates
all pages during the build process so viewing the tags list page or listing posts per tag
load instantly. Note that this approach relies on having a single tags list on each post
defined in the markdown header bits. Using dynamic #tags in content involves a bit more
work if that's what you're going for.
