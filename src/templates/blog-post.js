import React from "react"
import { Link, graphql } from "gatsby"
import SEO from "../components/seo"
import SharePost from "../components/share-post"
import Bio from "../components/bio"
import formatDate from "../components/format-date"
import "./blog-post.scss"

const BlogPostTemplate = ({ data }) => {
  const date = formatDate(data.markdownRemark.fields.gitTime)
  const post = data.markdownRemark
  const { title, siteUrl } = data.site.siteMetadata
  const tags = post.frontmatter.tags || []
  const tagsList = tags.map(t => (
    <Link key={t} to={`/tags/${t.replace(/ /g, '-')}`}>#{t}</Link>
  )).reduce((prev, curr) => [prev, ', ', curr])

  return (
    <>
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
              {post.timeToRead} min read
            </p>
          </div>
          <p>{tagsList}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <SharePost
          title={post.frontmatter.title}
          summary={post.excerpt}
          hashtags={tags}
          source={title}
          url={`${siteUrl}/${post.frontmatter.slug}`}
        />
      </article>
      <Bio />
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        gitTime
      }
      frontmatter {
        title
        tags
        image
        slug
      }
      timeToRead
    }
  }
`
