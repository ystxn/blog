import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

class PageTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const { title, description } = this.props.data.site.siteMetadata

    return (
      <Layout location={this.props.location} title={title} subTitle={description}>
        <SEO
          title={post.frontmatter.title}
          description={post.excerpt}
        />
        <h2>{post.frontmatter.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </Layout>
    )
  }
}

export default PageTemplate

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
