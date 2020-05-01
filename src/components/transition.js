import React from "react"
import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group"

const timeout = 150
const getTransitionStyles = {
  entering: {
    left: '2%',
    opacity: 0,
  },
  entered: {
    transition: `all ${timeout}ms ease-in`,
    left: 0,
    opacity: 1,
  },
  exiting: {
    left: '-2%',
    transition: `all ${timeout} ease-out`,
    opacity: 0
  }
}

const Transition = ({ children, location }) => {
  return (
    <TransitionGroup>
      <ReactTransition
        key={location.pathname}
        timeout={{
          enter: timeout,
          exit: timeout,
        }}
      >
        {status => (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              top: 0,
              ...getTransitionStyles[status],
            }}
          >
            {children}
          </div>
        )}
      </ReactTransition>
    </TransitionGroup>
  )
}

export default Transition
