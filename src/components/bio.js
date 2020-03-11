/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import profilePic from "../assets/profile-pic.jpg"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            linkedin
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  const profilePicStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    margin: "0.3em 0.8em 0.8em 0",
    border: "lightseagreen 2px solid"
  }

  return (
    <>
      <hr />
      <div
        style={{
          display: `flex`,
        }}
      >
        <img src={profilePic} alt={author.name} style={profilePicStyle} />
        <p>
          Written by <strong>{author.name}</strong> {author.summary}
          <br />
          <a target={`_blank`} href={`https://twitter.com/${social.twitter}`}>
            Twitter
          </a>
          &nbsp; &middot; &nbsp;
          <a target={`_blank`} href={`https://linkedin.com/in/${social.linkedin}`}>
            LinkedIn
          </a>
        </p>
      </div>
      <hr />
    </>
  )
}

export default Bio
