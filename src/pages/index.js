import React from "react"
import { Link, graphql } from "gatsby"
import Seo from "../components/seo"
import NewerOlder from "../components/newer-older"
import Bio from "../components/bio"
import formatDate from "../components/format-date"

const BlogIndex = ({ pageContext, data }) => {
  const posts = data.allMarkdownRemark.edges
  const totalCount = data.allMarkdownRemark.totalCount
  const { numPages, currentPage } = pageContext
  const newerOlderProps = {}
  if ((!numPages && totalCount > 5) || currentPage < numPages) {
    newerOlderProps.olderLink = `/${(currentPage || 1) + 1}`
  }
  if (currentPage && currentPage > 1) {
    newerOlderProps.newerLink = `/${currentPage === 2 ? '' : currentPage - 1}`
  }

  return (
    <>
      <Seo title="Home" />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        const { gitTime } = node.fields
        const date = formatDate(gitTime)
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
      <NewerOlder {...newerOlderProps} />
      <Bio />
    </>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query indexQuery($skip: Int! = 0, $limit: Int! = 5) {
    allMarkdownRemark(
      filter: {
        frontmatter: { templateKey: { ne: "page" } }
      }
      sort: { fields: [fields___slug], order: DESC }
      limit: $limit
      skip: $skip
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
      totalCount
    }
  }
`
