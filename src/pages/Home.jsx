import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHotels } from "../apis/hotelApi.js";
import SearchBar from "./SearchBar.jsx";

const Home = () => {
  const [searchParams] = useSearchParams();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // URL मधून search घेणे
  const searchValue = searchParams.get("search") || "";

  const fetchHotels = async (search = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await getHotels(search);

      setHotels(response.hotels || []);
    } catch (error) {
      console.log(
        "Hotel fetch error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(searchValue);
  }, [searchValue]);

  return (
    <div>

      {/* Search Bar */}
      <SearchBar />

      {/* Hotels */}
      <h1>Hotels</h1>

      {loading ? (
        <h2>Loading hotels...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : hotels.length === 0 ? (
        <p>No hotels found</p>
      ) : (
        <div>
          {hotels.map((hotel) => (
            <div key={hotel.id}>

              <img
                src={hotel.images?.[0]?.url}
                alt={hotel.name}
                width="250"
                height="160"
              />

              <h3>{hotel.name}</h3>

              <p>{hotel.location}</p>

              <p>{hotel.description}</p>

              <p>Rating: {hotel.rating}</p>

              <p>
                ₹{hotel.price_per_night} / night
              </p>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;