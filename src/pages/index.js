import React from "react"
import { Link, graphql } from "gatsby"
import SEO from "../components/seo"
import moment from "moment"
import Bio from "../components/bio"

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <>
      <SEO title="Home" />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        const { gitTime } = node.fields
        const date = gitTime ? moment(gitTime).format("MMM Do YYYY, h:mma")
          : '<Unpublished Post />'
        const tags = node.frontmatter.tags || []
        const tagsList = tags.length === 0 ? '' : tags
          .map(t => <Link key={t} to={`/tags/${t.replace(/ /g, "-")}`}>#{t}</Link>)
          .reduce((prev, curr) => [prev, ", ", curr])
        return (
          <article key={node.frontmatter.slug}>
            <header>
              <h3>
                <Link
                  style={{ boxShadow: `none` }}
                  to={`/${node.frontmatter.slug}`}
                >
                  {title}
                </Link>
              </h3>
              <div className='article-date'>
                <p>{date}</p>
                <p>
                  {node.timeToRead} min read
                </p>
              </div>
              <p>{tagsList}</p>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.excerpt,
                }}
              />
            </section>
          </article>
        )
      })}
      <Bio />
    </>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        frontmatter: { templateKey: { ne: "page" } }
      }
      sort: { fields: [fields___slug], order: DESC }
    ) {
      edges {
        node {
          excerpt(pruneLength: 280)
          fields {
            slug
            gitTime
          }
          frontmatter {
            slug
            title
            tags
          }
          timeToRead
        }
      }
    }
  }
`
