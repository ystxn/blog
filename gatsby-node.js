const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { execSync } = require('child_process')

exports.sourceNodes = ({ actions }) => {
  const { createTypes} = actions
  createTypes([`
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      draft: Boolean
    }
  `])
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(
    `
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                draft
                slug
                title
                tags
                templateKey
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  let tags = []
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    if (post.node.frontmatter.tags && post.node.frontmatter.draft === null) {
      tags = tags.concat(post.node.frontmatter.tags)
    }

    createPage({
      path: post.node.frontmatter.slug || post.node.fields.slug,
      component: path.resolve(
        `./src/templates/${post.node.frontmatter.templateKey}.js`
      ),
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  const tagTemplate = path.resolve("src/templates/tags.js")
  tags.filter((elem, pos, arr) => arr.indexOf(elem) === pos)
    .forEach(tag => {
      createPage({
        path: `/tags/${tag}/`,
        component: tagTemplate,
        context: { tag },
      })
    })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type === `MarkdownRemark`) {
    actions.createNodeField({
      name: `slug`,
      node,
      value: createFilePath({ node, getNode }),
    })

    actions.createNodeField({
      name: `draft`,
      node,
      value: node.frontmatter.draft || false,
    })

    if (node.frontmatter.templateKey === 'blog-post') {
      const relativePath = `content/blog/${node.fields.slug.replace(/\//g,'')}.md`
      const gitAuthorTime = execSync(
        `git log -1 --pretty=format:%aI ${relativePath}`
      ).toString().replace(/\+08:00/g, 'Z')
      actions.createNodeField({
        name: `gitAuthorTime`,
        node,
        value: gitAuthorTime,
      })
    }
  }
}
