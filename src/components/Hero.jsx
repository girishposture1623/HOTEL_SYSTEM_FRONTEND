import Navbar from "./Navbar";
import locationIcon from "../assets/logo.png";
import SearchBar from "./searchBar";
import "../Styles/Hero.css"
const Hero = () => {
  return (
    <section className="hero-area">
      <Navbar />

      <div className="hero-content">
        <div className="hero-label">
          <img src={locationIcon} alt="Location" />

          <span>EXPLORE AMAZING PLACES</span>
        </div>

        <h1>Hotels</h1>

        <p>Find the perfect hotel for your next adventure.</p>
      </div>
      <SearchBar/>
    </section>
  );
};

export default Hero;
