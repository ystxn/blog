const path = require(`path`)
const fs = require(`fs`)
const moment = require(`moment`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { execSync } = require(`child_process`)

const timestampsFile = `${__dirname}/blog/timestamps.json`
let timestamps
if (fs.existsSync(timestampsFile)) {
  timestamps = JSON.parse(fs.readFileSync(timestampsFile, 'utf8'))
}

exports.sourceNodes = ({ actions }) => {
  const { createTypes} = actions
  createTypes([`
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      image: String
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
    const template = post.node.frontmatter.templateKey || 'blog-post'
    createPage({
      path: post.node.frontmatter.slug || post.node.fields.slug,
      component: path.resolve(
        `./src/templates/${template}.js`
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
  if (node.internal.type !== `MarkdownRemark`) {
    return
  }

  actions.createNodeField({
    name: `slug`,
    node,
    value: createFilePath({ node, getNode }),
  })

  const { templateKey: template } = node.frontmatter
  if (!template || template === 'blog-post') {
    let gitTime
    const fileName = node.fields.slug.replace(/\//g, '')

    if (timestamps && timestamps[`${fileName}.md`]) {
      const timestamp = timestamps[`${fileName}.md`][`created`]
      gitTime = moment.unix(timestamp).format()
    } else {
      const relativePath = `blog/${fileName}.md`
      gitTime = execSync(
        `git log -1 --pretty=format:%aI ${relativePath}`
      ).toString()
    }
    actions.createNodeField({
      name: `gitTime`,
      node,
      value: gitTime,
    })
  }
}
