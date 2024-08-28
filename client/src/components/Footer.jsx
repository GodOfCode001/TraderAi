import React from 'react'
import './footer.css'
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaSquareGithub } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className='footer'>
        <div className="footer-container">

            <div className="logo">
                <h3>Trader Ai</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non obcaecati consequatur illo cumque incidunt tempora commodi veniam porro eius sequi.</p>
            </div>

            <div className="footer-menu">
                <div className="menu-1">
                    <div className="menu-header">Support</div>
                    <div className="sub-menu">Contact Us</div>
                    <div className="sub-menu">Chat</div>
                    <div className="sub-menu">Help Center</div>
                </div>

                <div className="menu-2">
                    <div className="menu-header">About</div>
                    <div className="sub-menu">About - Frist</div>
                    <div className="sub-menu">About - Second</div>
                    <div className="sub-menu">About - Third</div>
                </div>
                <div className="menu-3">
                    <div className="menu-header">Company</div>
                    <div className="sub-menu">About</div>
                    <div className="sub-menu">Information</div>
                    <div className="sub-menu">Privacy</div>
                </div>
                <div className="menu-4">
                    <div className="menu-header">Social</div>
                    <div className="sub-menu"><FaFacebookSquare /> Facebook </div>
                    <div className="sub-menu"><AiFillInstagram /> Instrgram</div>
                    <div className="sub-menu"><FaSquareGithub /> Gibhub</div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
