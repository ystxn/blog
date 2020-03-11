import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "./blog-post.css"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const { title, description } = data.site.siteMetadata
  const tags = post.frontmatter.tags || []
  const tagsList = tags.map(t => (
      <Link to={`/tags/${t.replace(/ /g, '-')}`}>#{t}</Link>
  )).reduce((prev, curr) => [prev, ', ', curr])

  return (
    <Layout location={location} title={title} subTitle={description}>
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
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
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
        tags
      }
    }
  }
`
