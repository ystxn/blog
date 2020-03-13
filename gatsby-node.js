const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { execSync } = require('child_process')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
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

    if (post.node.frontmatter.tags) {
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
  tags.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos
  }).forEach(tag => {
    createPage({
      path: `/tags/${tag.replace(/ /g, '-')}/`,
      component: tagTemplate,
      context: {
        tag,
      },
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

    const gitAuthorTime = execSync(
      `git log -1 --pretty=format:%aI ${node.fileAbsolutePath}`
    ).toString().replace(/\+08:00/g, 'Z')
    actions.createNodeField({
      name: `gitAuthorTime`,
      node,
      value: gitAuthorTime,
    })
  }
}
