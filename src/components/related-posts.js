import React from "react"
import { Link } from "gatsby"

const RelatedPosts = ({ posts }) => {
  const RelatedCard = ({ data }) => (
    <li>
      <Link to={`/${data.slug}`}>{data.title}</Link>
    </li>
  )
  const postList = (
    <ul>
      {posts.edges.map(edge =>
        <RelatedCard
          key={edge.node.frontmatter.slug}
          data={edge.node.frontmatter}
        />
      )}
    </ul>
  )
  const content = posts.edges.length ? postList
    : <i>Nothing here yet. This post is the first of its kind!</i>

  return (
    <>
      <h4>Related posts..</h4>
      { content }
    </>
  )
}
export default RelatedPosts
