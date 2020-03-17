import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data, location }) => {
  const { title, description } = data.site.siteMetadata
  const group = data.allMarkdownRemark.group
  const tags = group.map(tag =>
    <li key={tag.fieldValue}>
      <Link key={tag.fieldValue} to={`/tags/${tag.fieldValue.replace(/ /g, '-')}/`}>
        #{tag.fieldValue}
      </Link>
      {` (${tag.totalCount})`}
    </li>
  )

  return (
    <Layout location={location} title={title} subTitle={description}>
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
        description
      }
    }
    allMarkdownRemark(
      filter: {
        fields: { draft: { eq: false } }
      }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
