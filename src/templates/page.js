import React from "react"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import Bio from "../components/bio"
import "./page.scss"

class PageTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark

    return (
      <>
        <Seo
          title={post.frontmatter.title}
          description={post.excerpt}
        />
        <h2>{post.frontmatter.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />

        <Bio />
      </>
    )
  }
}

export default PageTemplate

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
      }
    }
  }
`
