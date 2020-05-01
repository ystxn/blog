import React from "react"
import { Link, graphql } from "gatsby"
import SEO from "../components/seo"
import Bio from "../components/bio"
import moment from "moment"
import "./blog-post.scss"
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon
} from "react-share";

const BlogPostTemplate = ({ data }) => {
  const { gitTime } = data.markdownRemark.fields
  const date = gitTime ? moment(gitTime).format("MMM Do YYYY, h:mma")
    : '<Unpublished Post />'
  const post = data.markdownRemark
  const { title, siteUrl } = data.site.siteMetadata
  const tags = post.frontmatter.tags || []
  const tagsList = tags.map(t => (
    <Link key={t} to={`/tags/${t.replace(/ /g, '-')}`}>#{t}</Link>
  )).reduce((prev, curr) => [prev, ', ', curr])
  const shareProps = {
    title: post.frontmatter.title,
    summary: post.excerpt,
    source: title,
    hashtags: tags,
    url: `${siteUrl}/${post.frontmatter.slug}`
  }
  const iconProps = {
    size: 32,
    round: true,
    iconFillColor: 'black'
  }

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
        <footer>
          <h4>Share this post:</h4>
          <FacebookShareButton {...shareProps} children={<FacebookIcon {...iconProps} />} />
          <LinkedinShareButton {...shareProps} children={<LinkedinIcon {...iconProps} />} />
          <TwitterShareButton {...shareProps} children={<TwitterIcon {...iconProps} />} />
          <WhatsappShareButton {...shareProps} children={<WhatsappIcon {...iconProps} />} />
        </footer>
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
