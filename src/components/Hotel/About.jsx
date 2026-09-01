import { Link } from "react-router-dom";
import "../../Styles/About.css";
import HotelImg from "../../assets/about/ManageHotel.png";
import SecureImg from "../../assets/about/Lock.png";
import StarImg from "../../assets/about/star.png";
import Navbar from "../Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-page">
        {/* ================= HERO ================= */}

        <section className="about-hero">
          <div className="about-hero-content">
            <p>STAYORA HOTELS & RESORTS</p>

            <h1>About Stayora</h1>

            <span>Your trusted hotel booking platform.</span>
          </div>
        </section>

        {/* ================= ABOUT ================= */}

        <section className="about-section">
          <div className="about-image">
            <img src="/images/about-hotel.jpg" alt="Stayora Hotel" />
          </div>

          <div className="about-content">
            <p className="about-small-title">ABOUT STAYORA</p>

            <h2>Making Hotel Booking Simple</h2>

            <p>
              Stayora is a simple and reliable hotel booking platform that helps
              travelers discover and book comfortable hotels with ease.
            </p>

            <p>
              We make it easy to search for hotels, view hotel details, check
              availability, and make bookings in one place.
            </p>
          </div>
        </section>

        {/* ================= WHY STAYORA ================= */}

        <section className="why-section">
          <div className="section-heading">
            <p>WHY CHOOSE US</p>

            <h2>Why Choose Stayora?</h2>
          </div>

          <div className="why-cards">
            <div className="why-card">
              <div className="why-icon">
                <img src={HotelImg} alt="" />
              </div>

              <h3>Easy Hotel Search</h3>

              <p>
                Find hotels quickly by destination and discover the right stay
                for you.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <img src={SecureImg} alt="" />
              </div>

              <h3>Secure Booking</h3>

              <p>Enjoy a safe and reliable hotel booking experience.</p>
            </div>

            <div className="why-card">
              <div className="why-icon">
                <img src={StarImg} alt="" />
              </div>

              <h3>Comfortable Stays</h3>

              <p>
                Discover hotels that match your needs and travel preferences.
              </p>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="about-cta">
          <div>
            <h2>Find Your Perfect Stay</h2>

            <p>Explore our hotels and book your next stay with Stayora.</p>
          </div>
          <Link to="/" className="explore-hotels-btn">
            Explore Hotels
          </Link>
        </section>
      </div>
    </>
  );
};

export default About;
