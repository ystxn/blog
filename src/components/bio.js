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
  const DotSpace = (key) => <span key={key}>&nbsp; &middot; &nbsp;</span>
  const socialLinks = Object.keys(social)
    .filter(platform => social[platform])
    .map(platform => {
      const path = platform === 'linkedIn' ? 'in/' : ''
      return (
        <a key={platform} target={`_blank`} rel={`nofollow noopener noreferrer`}
          href={`//${platform}.com/${path}${social[platform]}`}>
          {platform.replace(/^\w/, c => c.toUpperCase())}
        </a>
      )
    })
    .reduce((prev, curr) => [prev, <DotSpace key={curr} />, curr])

  return (
    <footer>
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
    </footer>
  )
}

export default Bio
