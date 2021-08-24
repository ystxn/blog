import React from "react"
import { Link, graphql } from "gatsby"
import Seo from "../components/seo"
import Bio from "../components/bio"

const Tags = ({ data }) => {
  const group = data.allMarkdownRemark.group
  const tags = group
    .sort((a, b) => b.totalCount - a.totalCount)
    .map(tag =>
      <li key={tag.fieldValue}>
        <Link key={tag.fieldValue} to={`/tags/${tag.fieldValue.replace(/ /g, '-')}/`}>
          #{tag.fieldValue}
        </Link>
        {` (${tag.totalCount})`}
      </li>
    )

  return (
    <>
      <Seo title="Tags" />
      <div>
        <h2>Tags</h2>
        <ul>{tags}</ul>
      </div>

      <Bio />
    </>
  )
};
export default Tags;

export const pageQuery = graphql`
  query {
    allMarkdownRemark {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
