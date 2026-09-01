import { Link } from "react-router-dom";
import "../../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

      
        <div className="footer-brand">

          <h2>Stayora</h2>

          <p>
            Find comfortable stays and make
            your travel experience better.
          </p>

        </div>



        <div className="footer-links">

          <h3>Quick Links</h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/hotels">
            Hotels
          </Link>

          <Link to="/aboutus">
            About Us
          </Link>

          <Link to="/contact">
            Contact
          </Link>

        </div>


  

        <div className="footer-contact">

          <h3>Contact</h3>

          <p>
            Mumbai, Maharashtra, India
          </p>

          <p>
            support@stayora.com
          </p>

        </div>

      </div>



      <div className="footer-bottom">

        <p>
          © 2026 Stayora Hotels & Resorts.
          All rights reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;