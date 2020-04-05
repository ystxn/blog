import React, { useState, useEffect } from "react"
import { CSSTransition } from 'react-transition-group';
import Bio from "../components/bio"
import { Link } from "gatsby"
import "./layout.scss"

const NavBar = () => (
  <nav className="main-nav">
    <ol>
      <li>
        <Link to="/">./home</Link>
      </li>
      <li>
        <Link to="/about">./about</Link>
      </li>
      <li>
        <Link to="/tags">./tags</Link>
      </li>
    </ol>
  </nav>
)

const SubTitle = ({ subTitle }) => (subTitle ? <h5>{subTitle}</h5> : "")

const Layout = ({ title, subTitle, children }) => {
  const [ scrolled, setScrolled ] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });
  const onScroll = () => setScrolled(window.scrollY > 200)
  const scrollToTop = () => window.scrollTo(0, 0)

  return (
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

      <CSSTransition
        in={scrolled}
        timeout={400}
        classNames="display"
        unmountOnExit
      >
        <div
          role="button"
          tabIndex={0}
          onClick={scrollToTop}
          onKeyDown={scrollToTop}
          className={`scrollButton`}
        >
          ^
        </div>
      </CSSTransition>
    </div>
  )
}
export default Layout
