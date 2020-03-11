import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import "./blog-post.css"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const tags = post.frontmatter.tags || []
  const tagsList = tags.map(t => (
      <Link to={`/tags/${t.replace(/ /g, '-')}`}>#{t}</Link>
  )).reduce((prev, curr) => [prev, ', ', curr])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
      />
      <article>
        <header>
          <h2>{post.frontmatter.title}</h2>
          <p>{post.frontmatter.date}</p>
          <p>{tagsList}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <hr style={{ marginBottom: rhythm(1) }} />
      <Bio />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`
