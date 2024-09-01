import { useState } from 'react';
import './homePage.css'
import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation';

const HomePage = () => {
  
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className='homepage'>
      <img src="/orbital.png" alt="" className='orbital'/>
      <div className="left">
        <h1>PHOENIX AI</h1>
        <h2>Visualize your Imagination</h2>
        <h3>Click below to dive into awesomeness.</h3>
        <Link to="/dashboard" className="getStarted">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className='bot'/>
          <div className="chat">
            <img src=
              {
                typingStatus === "human1" 
                  ? "/human1.jpeg" 
                  : typingStatus === "human2" 
                  ? "/human2.jpeg" 
                  : "/bot.png"} 
                alt="" className='chatBot'/>
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Human: We produce food for Mice",
                2000, ()=>{
                  setTypingStatus("bot");
                },
                "Bot: We produce food for Hamsters",
                2000,()=>{
                  setTypingStatus("human2");
                },
                "Human2: We produce food for Guinea Pigs",
                2000,()=>{
                  setTypingStatus("bot");
                },
                "Bot: We produce food for Chinchillas",
                2000,()=>{
                  setTypingStatus("human1");
                }
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/phoenixLogo2.png" alt="" className='logo'/>
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage;