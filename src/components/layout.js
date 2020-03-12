import React from "react"
import Bio from "../components/bio"
import { Link } from "gatsby"
import "./layout.css"

const NavBar = () =>
    <nav className='main-nav'>
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

const SubTitle = ({subTitle}) => subTitle ? <h5>{subTitle}</h5> : ''

const Layout = ({ title, subTitle, children }) =>
  <div className='envelope'>
    <header className='main-header'>
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
  </div>

export default Layout
