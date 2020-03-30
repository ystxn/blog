import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import moment from "moment"
import "./blog-post.scss"

const BlogPostTemplate = ({ data, location }) => {
  const { gitTime, readingTime } = data.markdownRemark.fields
  const date = gitTime ? moment(gitTime).format("MMM Do YYYY, h:mma")
    : '<Unpublished Post />'
  const post = data.markdownRemark
  const { title, description, siteUrl } = data.site.siteMetadata
  const tags = post.frontmatter.tags || []
  const tagsList = tags.map(t => (
    <Link key={t} to={`/tags/${t.replace(/ /g, '-')}`}>#{t}</Link>
  )).reduce((prev, curr) => [prev, ', ', curr])

  return (
    <Layout location={location} title={title} subTitle={description}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        image={`${siteUrl}/${post.frontmatter.image}`}
      />
      <article>
        <header>
          <h2>{post.frontmatter.title}</h2>
          <div className='article-date'>
            <p>{date}</p>
            <p>
              {Math.ceil(readingTime.minutes)} min read
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
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        gitTime
        readingTime {
          words
          minutes
        }
      }
      frontmatter {
        title
        tags
        image
      }
    }
  }
`
