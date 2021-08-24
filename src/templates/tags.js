import React from "react"
import { Link, graphql } from "gatsby"
import Seo from "../components/seo"
import Bio from "../components/bio"

const Tags = ({ pageContext, data }) => {
  const pageTitle = `#${pageContext.tag} posts`
  const posts = data.allMarkdownRemark.edges
    .map(({ node: { frontmatter: { title, slug } } }) =>
      <li key={slug}>
        <Link to={`/${slug}`}>{title}</Link>
      </li>
  )
  return (
    <>
      <Seo title={pageTitle} />
      <h2>{pageTitle} ({data.allMarkdownRemark.totalCount})</h2>
      <ul>{posts}</ul>
      <Bio />
    </>
  )
};
export default Tags;

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      filter: {
        frontmatter: { tags: { in: [$tag] } }
      }
      sort: { fields: [frontmatter___slug], order: DESC }
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
