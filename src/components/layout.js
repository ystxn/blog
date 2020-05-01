import React from "react"
import ScrollButton from './scroll-button'
import { Link } from "gatsby"
import "./layout.scss"
import Transition from "./transition"
import { useStaticQuery, graphql } from "gatsby"

const NavBar = () => {
  const links = [
    { label: 'home', to: '' },
    { label: 'about', to: 'about' },
    { label: 'tags', to: 'tags' }
  ].map(({ label, to }) => <li key={to}><Link to={`/${to}`}>./{label}</Link></li>)

  return (
    <nav className="main-nav">
      <ol>{links}</ol>
    </nav>
  )
}

const SubTitle = ({ subTitle }) => (subTitle ? <h5>{subTitle}</h5> : "")

const Layout = ({ location, children }) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `
  )
  const { title, description } = data.site.siteMetadata

  return (
    <div className="envelope">
      <header className="main-header">
        <h2>
          <Link to={`/`}>{title}</Link>
        </h2>
        <SubTitle subTitle={description} />
      </header>
      <NavBar />
      <main>
        <Transition location={location}>
          {children}
        </Transition>
      </main>
      <ScrollButton />
    </div>
  )
}
export default Layout
