import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ pageContext, data, location }) => {
  const { title, description } = data.site.siteMetadata
  const pageTitle = `#${pageContext.tag} posts`
  const posts = data.allMarkdownRemark.edges
    .map(({ node: { frontmatter: { title, slug } } }) =>
      <li key={slug}>
        <Link to={`/${slug}`}>{title}</Link>
      </li>
  )
  return (
    <Layout location={location} title={title} subTitle={description}>
      <SEO title={pageTitle} />
      <h2>{pageTitle} ({data.allMarkdownRemark.totalCount})</h2>
      <ul>{posts}</ul>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] } } }
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
