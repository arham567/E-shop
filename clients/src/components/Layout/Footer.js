import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer" style={{width:"100vw"}}>
      <h1 className="text-center">All Right Reserved &copy;AR Developers</h1>
      <p className="text-center" >
        <Link to="/about">About</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
  );
};

export default Footer;
