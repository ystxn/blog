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
  const transitionTime = 250
  const defaultStyle = {
    transition: 'all 250ms',
    left: '0',
    position: 'relative',
    width: '100%',
    opacity: 0
  }
  const transitionStyles = {
    entering: { left: '1%', opacity: 0 },
    entered: { left: '0', opacity: 1 }
  }
  const transitionProps = {
    defaultStyle, transitionStyles, transitionTime
  }
  return (
    <div className="envelope">
      <header className="main-header">
        <h2>
          <Link to={`/`}>{title}</Link>
        </h2>
        <SubTitle subTitle={subTitle} />
      </header>
      <NavBar />
      <main>
        <PageTransition {...transitionProps}>
          {children}
        </PageTransition>
      </main>
      <footer>
        <Bio />
      </footer>
      <ScrollButton />
    </div>
  )
}
export default Layout
