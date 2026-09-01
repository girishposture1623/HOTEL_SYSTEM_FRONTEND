import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../apis/api.js";
import SearchBar from "../SearchBar.jsx";
import Navbar from "../Navbar.jsx";
import Loader from '../../components/Loader.jsx'
import "../../Styles/Hotels.css";

import LocationImage from "../../assets/location.png";

const Hotels = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // SEARCH DATA
  // =====================================================

  const searchData = location.state?.searchData || {};

  const searchValue = searchData.search?.trim() || "";

  // =====================================================
  // STATES
  // =====================================================

  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedRatings, setSelectedRatings] = useState([]);

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [maxPrice, setMaxPrice] = useState(22000);

  const [currentPage, setCurrentPage] = useState(1);

  const hotelsPerPage = 9;
  // =====================================================
  // FETCH HOTELS
  // =====================================================

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError("");

        

        const response = await api.get("/hotel/hotels", {
          params: {
            search: searchValue,
          },
        });

       

        const allHotels = response.data?.hotels || [];

        

        setHotels(Array.isArray(allHotels) ? allHotels : []);
      } catch (error) {
        console.log("Get hotels error:", error.response?.data || error.message);

        setHotels([]);

        setError(error.response?.data?.message || "Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchValue]);

  // =====================================================
  // AMENITIES
  // =====================================================

  const amenities = useMemo(() => {
    const amenitySet = new Set();

    hotels.forEach((hotel) => {
      if (Array.isArray(hotel.amenities)) {
        hotel.amenities.forEach((amenity) => {
          if (amenity) {
            amenitySet.add(amenity);
          }
        });
      }
    });

    return [...amenitySet];
  }, [hotels]);

  // =====================================================
  // PRICE FILTER
  // =====================================================

  const handlePriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  // =====================================================
  // RATING FILTER
  // =====================================================

  const handleRatingChange = (star) => {
    setSelectedRatings((prev) => {
      if (prev.includes(star)) {
        return prev.filter((item) => item !== star);
      }

      return [...prev, star];
    });
  };

  // =====================================================
  // AMENITY FILTER
  // =====================================================

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((item) => item !== amenity);
      }

      return [...prev, amenity];
    });
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSelectedRatings([]);
    setSelectedAmenities([]);
    setMaxPrice(22000);
  };

  // =====================================================
  // FILTER HOTELS
  // =====================================================

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // -------------------------------------------------
      // PRICE
      // -------------------------------------------------

      const price = Number(hotel.price_per_night ?? hotel.pricePerNight ?? 0);

      if (price > maxPrice) {
        return false;
      }

      // -------------------------------------------------
      // RATING
      // -------------------------------------------------

      const rating = Number(hotel.rating || 0);

      if (selectedRatings.length > 0) {
        const ratingMatched = selectedRatings.some(
          (selectedRating) => Math.floor(rating) === selectedRating,
        );

        if (!ratingMatched) {
          return false;
        }
      }

      // -------------------------------------------------
      // AMENITIES
      // -------------------------------------------------

      if (selectedAmenities.length > 0) {
        const hotelAmenities = Array.isArray(hotel.amenities)
          ? hotel.amenities
          : [];

        const allAmenitiesMatched = selectedAmenities.every((amenity) =>
          hotelAmenities.includes(amenity),
        );

        if (!allAmenitiesMatched) {
          return false;
        }
      }

      return true;
    });
  }, [hotels, maxPrice, selectedRatings, selectedAmenities]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const startIndex = (currentPage - 1) * hotelsPerPage;

  const endIndex = startIndex + hotelsPerPage;

  const currentHotels = filteredHotels.slice(startIndex, endIndex);

  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, maxPrice, selectedRatings, selectedAmenities]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <Loader/>
  }

  // =====================================================
  // JSX
  // =====================================================

  return (
<div className="hotels-page">

  {/* =================================================
      NAVBAR
      ================================================= */}

  <Navbar />


  {/* =================================================
      SEARCH BAR
      ================================================= */}

  <SearchBar />


  {/* =================================================
      MAIN
      ================================================= */}

  <div className="main">


    {/* =================================================
        SECTION 1 - FILTER
        ================================================= */}

    <div className="section1">


      {/* FILTER HEADER */}

      <div className="filter-header">

        <h2>
          Filter Results
        </h2>

        <button
          type="button"
          onClick={clearFilters}
        >
          Clear All
        </button>

      </div>


      {/* =================================================
          PRICE RANGE
          ================================================= */}

      <div className="filter-section">

        <h3>
          Price Range
        </h3>

        <input
          type="range"
          min="500"
          max="22000"
          value={maxPrice}
          onChange={handlePriceChange}
        />

        <div className="price-values">

          <span>
            ₹500
          </span>

          <span>
            ₹{maxPrice.toLocaleString("en-IN")}+
          </span>

        </div>

      </div>


      {/* =================================================
          STAR RATING
          ================================================= */}

      <div className="filter-section">

        <h3>
          Star Rating
        </h3>

        {[5, 4, 3, 2, 1].map(
          (star) => (

            <label
              className="filter-option"
              key={star}
            >

              <input
                type="checkbox"
                checked={
                  selectedRatings.includes(
                    star
                  )
                }
                onChange={() =>
                  handleRatingChange(
                    star
                  )
                }
              />

              <span className="stars">
                {"★".repeat(star)}
              </span>

              <span>
                {star} Star
              </span>

              <span className="rating-number">
                {star}.0+
              </span>

            </label>

          )
        )}

      </div>


      {/* =================================================
          AMENITIES
          ================================================= */}

      <div className="filter-section">

        <h3>
          Amenities
        </h3>

        {amenities.map(
          (amenity) => (

            <label
              className="filter-option"
              key={amenity}
            >

              <input
                type="checkbox"
                checked={
                  selectedAmenities.includes(
                    amenity
                  )
                }
                onChange={() =>
                  handleAmenityChange(
                    amenity
                  )
                }
              />

              <span>
                {amenity}
              </span>

            </label>

          )
        )}

      </div>


      {/* =================================================
          CLEAR FILTERS
          ================================================= */}

      <button
        type="button"
        className="clear-filters-btn"
        onClick={clearFilters}
      >
        ↻ Clear Filters
      </button>


    </div>


    {/* =================================================
        SECTION 2 - HOTELS
        ================================================= */}

    <div className="section2">


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (

        <div className="no-hotels">

          <h2>
            {error}
          </h2>

        </div>

      )}


      {/* =================================================
          NO HOTELS
          ================================================= */}

      {!error &&
      filteredHotels.length === 0 ? (

        <div className="no-hotels">

          <h2>
            No hotels found
          </h2>

          {searchValue && (

            <p>
              No hotels found for{" "}
              <strong>
                "{searchValue}"
              </strong>
            </p>

          )}

        </div>

      ) : (

        !error && (

          <>

            {/* =================================================
                HOTEL LIST
                ================================================= */}

            <div className="hotel-list">

              {currentHotels.map(
                (hotel) => (

                  <div
                    className="hotel-card"
                    key={hotel.id}
                  >


                    {/* =================================================
                        IMAGE
                        ================================================= */}

                    <div className="hotel-image">

                      {hotel.images?.length > 0 ? (

                        <img
                          src={
                            hotel.images[0].url
                          }
                          alt={
                            hotel.name
                          }
                        />

                      ) : (

                        <div className="no-image">
                          No Image Available
                        </div>

                      )}

                    </div>


                    {/* =================================================
                        INFO
                        ================================================= */}

                    <div className="hotel-info">


                      {/* HOTEL NAME */}

                      <h2>
                        {hotel.name}
                      </h2>


                      {/* LOCATION */}

                      <p className="hotel-location">

                        <img
                          src={
                            LocationImage
                          }
                          alt=""
                        />

                        {hotel.location}

                      </p>


                      {/* RATING */}

                      <div className="hotel-rating">

                        <span>
                          ★
                        </span>

                        <strong>
                          {hotel.rating || 0}
                        </strong>

                        <span>
                          / 5
                        </span>

                      </div>


                      {/* AMENITIES */}

                      {hotel.amenities?.length > 0 && (

                        <div className="hotel-amenities">

                          {hotel.amenities
                            .slice(0, 3)
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

                        </div>

                      )}


                      {/* PRICE + BUTTON */}

                      <div className="hotel-bottom">


                        <div className="hotel-price">

                          <strong>

                            ₹
                            {Number(
                              hotel.price_per_night ??
                              hotel.pricePerNight ??
                              0
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </strong>

                          <span>
                            / night
                          </span>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/hotelsDitails/${hotel.id}`
                            )
                          }
                        >
                          View Hotel
                        </button>


                      </div>


                    </div>


                  </div>

                )
              )}

            </div>


            {/* =================================================
                PAGINATION
                ================================================= */}

            {totalPages > 1 && (

              <div className="hotels-pagination">


                {/* PREVIOUS */}

                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage - 1
                    )
                  }
                >
                  ‹
                </button>


                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        `pagination-number ${
                          currentPage === page
                            ? "active"
                            : ""
                        }`
                      }
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                    >
                      {page}
                    </button>

                  )
                )}


                {/* NEXT */}

                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      currentPage + 1
                    )
                  }
                >
                  ›
                </button>


              </div>

            )}

          </>

        )

      )}


    </div>


  </div>


</div>
  );
};

export default Hotels;
