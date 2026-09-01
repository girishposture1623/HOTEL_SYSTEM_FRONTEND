import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from '../../components/Loader.jsx'
import Navbar from "../Navbar.jsx";
import LocationImg from '../../assets/location.png'
import SearchImg from '../../assets/search-interface-symbol.png'

import {
  getHotels,
  deletHotel,
} from "../../apis/adminApi.js";

import "../../Styles/AdminHotels.css";

const AdminHotels = () => {
  const navigate = useNavigate();

 
  const [hotels, setHotels] = useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

 
  const fetchHotels = async (
    searchValue = ""
  ) => {
    try {
      setLoading(true);
      setError("");



      const response =
        await getHotels({
          search: searchValue,
        });



      const hotelData =
        response.data?.hotels || [];

      setHotels(
        Array.isArray(hotelData)
          ? hotelData
          : []
      );

    } catch (error) {
      console.log(
        "Get admin hotels error:",
        error.response?.data ||
          error.message
      );

      setHotels([]);

      setError(
        error.response?.data
          ?.message ||
          "Failed to load hotels"
      );

    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchHotels();
  }, []);

  
  const handleSearch = (e) => {
    const value =
      e.target.value;

    setSearch(value);

    fetchHotels(value);
  };

  
  const handleClearSearch = () => {
    setSearch("");
    setSuccess("");
    fetchHotels("");
  };

  
  const handleAddHotel = () => {
    navigate(
      "/admin/hotels/add"
    );
  };

  
  const handleEditHotel = (
    id
  ) => {
    navigate(
      `/admin/hotels/edit/${id}`
    );
  };

  
  const handleViewHotel = (
    id
  ) => {
    navigate(
      `/hotelsDitails/${id}`
    );
  };

  
  const handleDeleteHotel =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this hotel?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(id);
        setError("");
        setSuccess("");

        const response =
          await deletHotel(id);


        if (
          response.data?.success
        ) {
          setSuccess(
            "Hotel deleted successfully."
          );

         
          setHotels(
            (prev) =>
              prev.filter(
                (hotel) =>
                  hotel.id !== id
              )
          );

        } else {
          setError(
            response.data?.message ||
              "Failed to delete hotel"
          );
        }

      } catch (error) {
        console.log(
          "Delete hotel error:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to delete hotel"
        );

      } finally {
        setDeletingId(null);
      }
    };


  const getHotelImage = (
    hotel
  ) => {
    if (
      Array.isArray(
        hotel.images
      ) &&
      hotel.images.length > 0
    ) {
      return (
        hotel.images[0].url ||
        hotel.images[0].image_url ||
        ""
      );
    }

    return "";
  };

  
  const getHotelPrice = (
    hotel
  ) => {
    return Number(
      hotel.price_per_night ??
        hotel.pricePerNight ??
        0
    );
  };


  const getHotelRooms = (
    hotel
  ) => {
    return (
      hotel.total_rooms ??
      hotel.totalRooms ??
      0
    );
  };

  if (
    loading &&
    hotels.length === 0
  ) {
    return <Loader/>
  }

 
  return (
    <div className="admin-hotels-page">

 
      <Navbar />


  
      <div className="admin-hotels-container">

        <div className="admin-hotels-header">

          <div>

            <h1>
              Hotels
            </h1>

            <p>
              Manage all hotels in Stayora
            </p>

          </div>


          <button
            type="button"
            className="add-hotel-btn"
            onClick={
              handleAddHotel
            }
          >
            + Add Hotel
          </button>

        </div>


        {success && (
          <div className="admin-success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="admin-error-message">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>
        )}


        <div className="admin-hotels-toolbar">

          <div className="admin-search-box">

            <span className="search-icon">
              <img src={SearchImg} alt="" />
            </span>

            <input
              type="text"
              value={search}
              onChange={
                handleSearch
              }
              placeholder="Search hotel, location or description..."
            />

            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={
                  handleClearSearch
                }
              >
                ×
              </button>
            )}

          </div>


          <div className="hotel-count">

            {loading
              ? "Searching..."
              : `${hotels.length} hotel${
                  hotels.length !==
                  1
                    ? "s"
                    : ""
                } found`}

          </div>

        </div>


     
        {hotels.length ===
        0 ? (

          <div className="no-hotels">

            <div className="no-hotels-icon">
              🏨
            </div>

            <h2>
              No hotels found
            </h2>

            {search ? (
              <p>
                No hotels found for{" "}
                <strong>
                  "{search}"
                </strong>
              </p>
            ) : (
              <p>
                There are no hotels available.
              </p>
            )}

            {search ? (

              <button
                type="button"
                className="clear-search-empty-btn"
                onClick={
                  handleClearSearch
                }
              >
                Clear Search
              </button>

            ) : (

              <button
                type="button"
                className="add-empty-hotel-btn"
                onClick={
                  handleAddHotel
                }
              >
                + Add Hotel
              </button>

            )}

          </div>

        ) : (

          <div className="admin-hotel-grid">

            {hotels.map(
              (hotel) => {

                const image =
                  getHotelImage(
                    hotel
                  );

                const price =
                  getHotelPrice(
                    hotel
                  );

                const rooms =
                  getHotelRooms(
                    hotel
                  );

                return (

                  <div
                    className="admin-hotel-card"
                    key={
                      hotel.id
                    }
                  >

                    
                    <div className="admin-hotel-image">

                      {image ? (

                        <img
                          src={image}
                          alt={
                            hotel.name
                          }
                        />

                      ) : (

                        <div className="admin-no-image">
                          <span>
                            🏨
                          </span>

                          <p>
                            No Image
                          </p>
                        </div>

                      )}

                    

                      <div className="admin-rating">

                        <span>
                          ★
                        </span>

                        {Number(
                          hotel.rating ||
                            0
                        ).toFixed(1)}

                      </div>

                    </div>


                    <div className="admin-hotel-content">

                      {/* NAME */}

                      <h2>
                        {hotel.name}
                      </h2>


                      {/* LOCATION */}

                      <p className="admin-hotel-location">

                        <span>
                          <img src={LocationImg} alt="" />
                        </span>

                        {hotel.location}

                      </p>


                      

                      {hotel.description && (

                        <p className="admin-hotel-description">

                          {hotel.description.length >
                          120
                            ? `${hotel.description.slice(
                                0,
                                120
                              )}...`
                            : hotel.description}

                        </p>

                      )}


                      {/* =================================================
                          AMENITIES
                          ================================================= */}

                      {Array.isArray(
                        hotel.amenities
                      ) &&
                        hotel.amenities
                          .length >
                          0 && (

                          <div className="admin-hotel-amenities">

                            {hotel.amenities
                              .slice(
                                0,
                                4
                              )
                              .map(
                                (
                                  amenity,
                                  index
                                ) => (

                                  <span
                                    key={`${hotel.id}-${index}`}
                                  >
                                    {amenity}
                                  </span>

                                )
                              )}

                            {hotel
                              .amenities
                              .length >
                              4 && (

                              <span className="more-amenities">
                                +
                                {hotel
                                  .amenities
                                  .length -
                                  4}
                              </span>

                            )}

                          </div>

                        )}


                      {/* =================================================
                          PRICE / ROOMS
                          ================================================= */}

                      <div className="admin-hotel-meta">

                        <div className="admin-price">

                          <strong>
                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <span>
                            / night
                          </span>

                        </div>


                        <div className="admin-rooms">

                          <span>
                            🛏
                          </span>

                          {rooms}{" "}
                          rooms

                        </div>

                      </div>


                      
                      <div className="admin-hotel-actions">

                        <button
                          type="button"
                          className="view-hotel-btn"
                          onClick={() =>
                            handleViewHotel(
                              hotel.id
                            )
                          }
                        >
                          View
                        </button>


                        <button
                          type="button"
                          className="edit-hotel-btn"
                          onClick={() =>
                            handleEditHotel(
                              hotel.id
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          className="delete-hotel-btn"
                          onClick={() =>
                            handleDeleteHotel(
                              hotel.id
                            )
                          }
                          disabled={
                            deletingId ===
                            hotel.id
                          }
                        >
                          {deletingId ===
                          hotel.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminHotels;