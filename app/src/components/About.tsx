import React from 'react'

const About: React.FC = props => {
  return (
        <div className="about-panel">
          <div className="about-panel-text">
            <span className="my-green"><b>About: </b></span>
            <br/><br/>
            If you'd like to support our work, please mint a
            piece of our collection at <a target="blank" href="https://www.the23.wtf" className="my-green">
            the23.wtf</a>
            <br/><br/>
            It's a collection of <a target="blank" href="https://twitter.com/the100pieces" className="my-green">
            100 pieces of shit</a> to record crypto events and hack the planet.
          </div>
        </div>
  )
}

export default About
