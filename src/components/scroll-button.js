import React, { useState, useEffect } from "react"
import { FaAngleUp } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';
import "./scroll-button.scss"

const ScrollButton = () => {
    const [ scrolled, setScrolled ] = useState(false);
    useEffect(() => {
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    });
    const onScroll = () => setScrolled(window.scrollY > 200)
    const scrollToTop = () => window.scrollTo(0, 0)

    return (
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
                <FaAngleUp />
            </div>
        </CSSTransition>
    )
}
export default ScrollButton
