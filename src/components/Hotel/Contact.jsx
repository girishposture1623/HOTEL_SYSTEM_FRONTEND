import { useState } from "react";
import "../../Styles/Contact.css";

import EmailImg from '../../assets/about/email.png'
import CallImg from '../../assets/about/call.png'
import LocationImg from '../../assets/about/location.png'
import Navbar from "../Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


 const handleSubmit = (e) => {
  e.preventDefault();

  const { name, email, message } = formData;

  const subject = `Contact Message from ${name}`;

  const body = `Hello Stayora Team,

Name: ${name}

Email: ${email}

Message:
${message}`;

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm` +
    `&to=bookinghotel180@gmail.com` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank");
};

  return (
    <>
    <Navbar/>
    <div className="contact-page">
     

      <section className="contact-hero">
        <div className="contact-hero-content">
          <p>STAYORA HOTELS & RESORTS</p>

          <h1>Contact Us</h1>

          <span>Get in touch with Stayora</span>
        </div>
      </section>

     

      <section className="contact-section">
      

        <div className="contact-info">
          <p className="contact-small-title">GET IN TOUCH</p>

          <h2>We'd Love to Hear From You</h2>

          <p className="contact-description">
            Have a question or need help with your booking? Feel free to contact
            us.
          </p>

      

          <div className="contact-item">
            <div className="contact-icon"><img src={LocationImg} alt="" /></div>

            <div>
              <h3>Address</h3>

              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>

         

          <div className="contact-item">
            <div className="contact-icon"><img src={EmailImg} alt="" /></div>

            <div>
              <h3>Email</h3>

              <p>support@stayora.com</p>
            </div>
          </div>

         

          <div className="contact-item">
            <div className="contact-icon"><img src={CallImg} alt="" /></div>

            <div>
              <h3>Phone</h3>

              <p>+91 XXXXX XXXXX</p>
            </div>
          </div>
        </div>

     
        <div className="contact-form-container">
          <h2>Send us a message</h2>

          <form onSubmit={handleSubmit}>
        

            <div className="contact-form-group">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

  

            <div className="contact-form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="message">Message</label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows="5"
                required
              />
            </div>


            <button type="submit" className="contact-submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
    </>
    
  );
};

export default Contact;
