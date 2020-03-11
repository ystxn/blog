import React from "react"
import Layout from "../components/layout"
import { Link, graphql } from "gatsby"
import SEO from "../components/seo"

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
  location,
}) => (
  <Layout location={location} title={title}>
    <SEO
      title="Tags"
      keywords={[`blog`, `gatsby`, `javascript`, `react`]}
    />
    <div>
      <h2>Tags</h2>
      <ul>
        {group.map(tag => (
          <li key={tag.fieldValue}>
            <Link to={`/tags/${tag.fieldValue.replace(/ /g, '-')}/`}>
              #{tag.fieldValue}
            </Link>
            {` `}
            ({tag.totalCount})
          </li>
        ))}
      </ul>
    </div>
  </Layout>
)

export default TagsPage

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