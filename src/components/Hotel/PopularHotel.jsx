import { useEffect, useState } from "react";
import api from "../../apis/api";
import "../../Styles/PopularHotels.css";

import LocationImage from "../../assets/location.png";
import PoolImg from "../../assets/icons8-pool-30.png";
import WifiImg from "../../assets/icons8-wifi-48.png";
import RestaurantImg from "../../assets/icons8-restaurant-50.png";
import ParkingImg from "../../assets/icons8-carpark-24.png";
import AcImg from "../../assets/icons8-ac-32.png";
import DeadLiftImg from "../../assets/icons8-gym-50.png";
import RoomServiceImg from "../../assets/icons8-room-service-50.png";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

const PopularHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get("/hotel/hotels");
        
        
      } catch (error) {
        console.log("Get hotels error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Loading
  if (loading) {
    return  <Loader/>;
  }

  return (
    <section className="popular-hotels">
      <div className="hotel-grid">
        {[...hotels]
          .sort(() => Math.random() - 0.5)
          .slice(0, 9)
          .map((hotel) => (
            <div className="hotel-card" key={hotel.id}>
              {/* ================= IMAGE ================= */}

              <div className="hotel-image">
                <img src={hotel.images?.[0]?.url} alt={hotel.name} />

                <div className="hotel-rating">
                  <span>★</span>
                  <span>{hotel.rating || 0}</span>
                </div>
              </div>

              {/* ================= HOTEL INFO ================= */}

              <div className="hotel-info">
                <h3>{hotel.name}</h3>

                {/* Location */}

                <p className="hotel-location">
                  <img src={LocationImage} alt="" />

                  {hotel.location}
                </p>

                {/* ================= AMENITIES ================= */}

                <div className="amenities">
                  {[
                    {
                      name: "Free WiFi",
                      label: "WiFi",
                      image: WifiImg,
                    },
                    {
                      name: "AC",
                      label: "AC",
                      image: AcImg,
                    },
                    {
                      name: "Swimming Pool",
                      label: "Pool",
                      image: PoolImg,
                    },
                    {
                      name: "Restaurant",
                      label: "Restaurant",
                      image: RestaurantImg,
                    },
                    {
                      name: "Parking",
                      label: "Parking",
                      image: ParkingImg,
                    },
                    {
                      name: "Gym",
                      label: "Gym",
                      image: DeadLiftImg,
                    },
                    {
                      name: "Room Service",
                      label: "Service",
                      image: RoomServiceImg,
                    },
                  ]
                    .filter((amenity) =>
                      hotel.amenities?.includes(amenity.name),
                    )
                    .slice(0, 4)
                    .map((amenity) => (
                      <div className="amenity" key={amenity.name}>
                        <img src={amenity.image} alt={amenity.name} />

                        <span>{amenity.label}</span>
                      </div>
                    ))}
                </div>

                {/* ================= BOTTOM ================= */}

                <div className="hotel-bottom">
                  <div>
                    <strong>
                      ₹
                      {Number(hotel.price_per_night || 0).toLocaleString(
                        "en-IN",
                      )}
                    </strong>

                    <span>/ night</span>
                  </div>

                  {/* View Hotel */}

                  <button
                    onClick={() => navigate(`/hotelsDitails/${hotel.id}`)}
                  >
                    View Hotel
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default PopularHotels;
