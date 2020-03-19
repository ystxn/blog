/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import profilePic from "../assets/profile-pic.jpg"
import "./layout.scss"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          disclaimer
          social {
            twitter
            gitHub
            linkedIn
          }
        }
      }
    }
  `)

  const { author, disclaimer, social } = data.site.siteMetadata
  const socialLinks = Object.keys(social)
    .filter(platform => social[platform])
    .map(platform => {
      const path = platform === 'linkedIn' ? 'in/' : ''
      return (
        <a target={`_blank`} rel={`nofollow noopener noreferrer`}
          href={`//${platform}.com/${path}${social[platform]}`}>
          {platform.replace(/^\w/, c => c.toUpperCase())}
        </a>
      )
    })
    .reduce((prev, curr) => [prev, <>&nbsp; &middot; &nbsp;</>, curr])

  return (
    <>
      <hr />
      <div style={{ display: `flex` }}>
        <img src={profilePic} alt={author.name} className='profile-pic' />
        <div>
          <p>Written by <strong>{author.name}</strong> {author.summary}</p>
          <p>{socialLinks}</p>
          <p><small><em>{disclaimer}</em></small></p>
        </div>
      </div>
      <hr />
    </>
  )
}

export default Bio
