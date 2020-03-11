import React from "react"
import { Link } from "gatsby"
import { rhythm } from "../utils/typography"
import "./layout.css"

const NavBar = () => {
  return (
    <nav>
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/tags">Tags</Link>
        </li>
      </ol>
    </nav>
  )
}

const Layout = ({ title, children }) => {
  const headerStyle = {
    boxShadow: `none`,
    textDecoration: `none`,
    color: `inherit`,
  }
  const header = (
    <h2>
      <Link style={headerStyle} to={`/`}>
        {title}
      </Link>
    </h2>
  )

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <NavBar />
      <main>{children}</main>
      <footer>© {new Date().getFullYear()} Yong Sheng Tan</footer>
    </div>
  )
}

export default Layout
