import React from "react"
import PageTransition from 'gatsby-plugin-page-transitions';
import ScrollButton from './scroll-button'
import Bio from "../components/bio"
import { Link } from "gatsby"
import "./layout.scss"

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

const Layout = ({ title, subTitle, children }) => {
  return (
    <PageTransition
      defaultStyle={{
        transition: 'all 250ms',
        left: '0',
        position: 'absolute',
        width: '100%',
        opacity: 0
      }}
      transitionStyles={{
        entering: { left: '30%', opacity: 0 },
        entered: { left: '0', opacity: 1 }
      }}
      transitionTime={250}
    >
      <div className="envelope">
        <header className="main-header">
          <h2>
            <Link to={`/`}>{title}</Link>
          </h2>
          <SubTitle subTitle={subTitle} />
        </header>
        <NavBar />
        <main>{children}</main>
        <footer>
          <Bio />
        </footer>
        <ScrollButton />
      </div>
    </PageTransition>
  )
}
export default Layout
