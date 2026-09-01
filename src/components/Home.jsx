import Hero from "./Hero";
import PopularHotels from "../components/Hotel/PopularHotel"

const Home = () => {
  return (
    <main className="home-page">
      <Hero />
      <PopularHotels />
    </main>
  );
};

export default Home;
