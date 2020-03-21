import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "./blog-post.scss"

const BlogPostTemplate = ({ data, location }) => {
  const { gitTime, readingTime } = data.markdownRemark.fields
  const date = gitTime === 'Invalid date' ? '<Unpublished Post />' : gitTime
  const post = data.markdownRemark
  const { title, description } = data.site.siteMetadata
  const tags = post.frontmatter.tags || []
  const tagsList = tags.map(t => (
      <Link key={t} to={`/tags/${t.replace(/ /g, '-')}`}>#{t}</Link>
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
          <div class="article-date">
            <p>{date}</p>
            <p>
              {readingTime.words} words,{` `}
              {Math.ceil(readingTime.minutes)} mins to read
            </p>
          </div>
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
      fields {
        gitTime(formatString: "MMM Do YYYY, h:mma")
        readingTime {
          words
          minutes
        }
      }
      frontmatter {
        title
        tags
      }
    }
  }
`
