import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../apis/api.js";
import "../../Styles/HotelDetails.css";
import LocationImage from "../../assets/location.png";
import Navbar from "../Navbar.jsx";

import { useAuth } from "../../Context/AuthContext.jsx";
import AdultsImage from "../../assets/user.png";
import ChildImage from "../../assets/icons8-children-50.png";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const {
    user,
    loading: authLoading,
  } = useAuth();


  const [hotel, setHotel] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [adults, setAdults] =
    useState(2);

  const [children, setChildren] =
    useState(0);

  const [rooms, setRooms] =
    useState(1);



  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/home/hotels/${id}`
          );

     

        setHotel(
          response.data?.hotel
        );

      } catch (error) {
        console.log(
          "Get hotel details error:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load hotel"
        );

      } finally {
        setLoading(false);
      }
    };


    if (id) {
      fetchHotel();
    }

  }, [id]);


  // =====================================================
  // DATE HELPERS
  // =====================================================

  const getToday = () => {
    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  const calculateNights = () => {
    if (
      !checkIn ||
      !checkOut
    ) {
      return 0;
    }

    const start =
      new Date(checkIn);

    const end =
      new Date(checkOut);

    const difference =
      end.getTime() -
      start.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  };


  // =====================================================
  // PRICE
  // =====================================================

  const pricePerNight =
    Number(
      hotel?.price_per_night ??
        hotel?.pricePerNight ??
        0
    );

  const nights =
    calculateNights();

  const roomTotal =
    pricePerNight *
    nights *
    rooms;

  const taxes =
    Math.round(
      roomTotal * 0.12
    );

  const grandTotal =
    roomTotal + taxes;


  // =====================================================
  // CHECK-IN CHANGE
  // =====================================================

  const handleCheckInChange = (e) => {

    const value =
      e.target.value;

    setCheckIn(value);

    if (
      checkOut &&
      value >= checkOut
    ) {
      setCheckOut("");
    }
  };


  // =====================================================
  // CHECK-OUT CHANGE
  // =====================================================

  const handleCheckOutChange = (e) => {

    const value =
      e.target.value;

    if (
      checkIn &&
      value <= checkIn
    ) {
      alert(
        "Check-out date must be after check-in date."
      );

      return;
    }

    setCheckOut(value);
  };


  // =====================================================
  // CHECK AVAILABILITY
  // =====================================================

  const handleCheckAvailability =
    () => {

      // =================================================
      // WAIT FOR AUTH CHECK
      // =================================================

      if (authLoading) {
        return;
      }


      // =================================================
      // LOGIN CHECK
      // =================================================

      if (!user) {

        alert(
          "Please login to check availability."
        );

        navigate("/login", {
          state: {
            from:
              `/hotelsDitails/${id}`,
          },
        });

        return;
      }


      // =================================================
      // DATE VALIDATION
      // =================================================

      if (!checkIn) {

        alert(
          "Please select check-in date."
        );

        return;
      }


      if (!checkOut) {

        alert(
          "Please select check-out date."
        );

        return;
      }


      if (nights <= 0) {

        alert(
          "Please select valid dates."
        );

        return;
      }


      // =================================================
      // ROOM VALIDATION
      // =================================================

      if (rooms < 1) {

        alert(
          "Please select at least one room."
        );

        return;
      }


      // =================================================
      // BOOKING DATA
      // =================================================




      // =================================================
      // GO TO BOOKING
      // =================================================

      navigate(
        "/booking",
        {
          state: {

            hotel,

            bookingData: {
              hotelId: id,
              checkIn,
              checkOut,
              adults,
              children,
              rooms,
              nights,
              pricePerNight,
              roomTotal,
              taxes,
              grandTotal,
            },

          },
        }
      );
    };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="hotel-loading">

          <div className="hotel-loading-spinner"></div>

          <p>
            Loading hotel...
          </p>

        </div>
      </>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <>
        <Navbar />

        <div className="hotel-not-found">

          <h2>
            {error}
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
          >
            Go Back
          </button>

        </div>
      </>
    );
  }


  // =====================================================
  // HOTEL NOT FOUND
  // =====================================================

  if (!hotel) {

    return (
      <>
        <Navbar />

        <div className="hotel-not-found">

          <h2>
            Hotel not found
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/hotels")
            }
          >
            Back to Hotels
          </button>

        </div>
      </>
    );
  }


  // =====================================================
  // HOTEL IMAGES
  // =====================================================

  const images =
    Array.isArray(
      hotel.images
    )
      ? hotel.images
      : [];


  // =====================================================
  // AMENITIES
  // =====================================================

  const amenities =
    Array.isArray(
      hotel.amenities
    )
      ? hotel.amenities
      : [];


  // =====================================================
  // JSX
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="main-details">

        {/* =================================================
            SECTION 1
            ================================================= */}

        <section className="section1">

          {/* =================================================
              HOTEL INFORMATION
              ================================================= */}

          <div className="rating">

            <div className="rate">

              <strong>
                ★{" "}
                {Number(
                  hotel.rating || 0
                ).toFixed(1)}
              </strong>

              <span>
                / 5
              </span>

            </div>


            <div className="title">

              <h3>
                {hotel.name}
              </h3>

            </div>


            <div className="location">

              <img
                src={LocationImage}
                alt="Location"
              />

              <span>
                {hotel.location}
              </span>

            </div>

          </div>


          {/* =================================================
              IMAGE GALLERY
              ================================================= */}

          {images.length > 0 ? (

            <div className="hotel-gallery">

              {/* MAIN IMAGE */}

              <div className="gallery-main">

                <img
                  src={images[0].url}
                  alt={`${hotel.name} 1`}
                  onClick={() =>
                    setSelectedImage(
                      images[0].url
                    )
                  }
                />

                <span className="image-count">
                  1 / {images.length}
                </span>

              </div>


              {/* SIDE IMAGES */}

              <div className="gallery-side">

                {images
                  .slice(1, 5)
                  .map(
                    (
                      image,
                      index
                    ) => {

                      const isLastImage =
                        index === 3 &&
                        images.length > 5;

                      return (
                        <div
                          className="gallery-small"
                          key={
                            image.id ||
                            image.public_id ||
                            index
                          }
                        >

                          <img
                            src={image.url}
                            alt={`${hotel.name} ${
                              index + 2
                            }`}
                            onClick={() =>
                              setSelectedImage(
                                image.url
                              )
                            }
                          />


                          {isLastImage && (

                            <div
                              className="view-all-overlay"
                              onClick={() =>
                                setSelectedImage(
                                  image.url
                                )
                              }
                            >

                              <strong>
                                +
                                {images.length - 5}
                              </strong>

                              <span>
                                View all photos
                              </span>

                            </div>

                          )}

                        </div>
                      );
                    }
                  )}

              </div>

            </div>

          ) : (

            <div className="hotel-no-images">

              <span>
                🏨
              </span>

              <p>
                No images available
              </p>

            </div>

          )}


          {/* =================================================
              ABOUT HOTEL
              ================================================= */}

          <div className="disc">

            <h4>
              About This Hotel
            </h4>

            <p>
              {hotel.description ||
                "No description available for this hotel."}
            </p>

          </div>


          {/* =================================================
              AMENITIES
              ================================================= */}

          <div className="amenities">

            <h4>
              Amenities
            </h4>

            {amenities.length > 0 ? (

              <div className="amenities-list">

                {amenities.map(
                  (
                    amenity,
                    index
                  ) => (

                    <div
                      className="amenity-item"
                      key={`${hotel.id}-${index}`}
                    >
                      {amenity}
                    </div>

                  )
                )}

              </div>

            ) : (

              <p>
                No amenities available
              </p>

            )}

          </div>

        </section>


        {/* =====================================================
            SECTION 2 - BOOKING
            ===================================================== */}

        <section className="section2">

          <div className="booking-card">

            <h2>
              Book Your Stay
            </h2>


            {/* =================================================
                DATES
                ================================================= */}

            <div className="date-row">

              <div className="date-field">

                <label>
                  Check-in
                </label>

                <div className="input-box">

                  <input
                    type="date"
                    value={checkIn}
                    min={getToday()}
                    onChange={
                      handleCheckInChange
                    }
                  />

                </div>

              </div>


              <div className="date-field">

                <label>
                  Check-out
                </label>

                <div className="input-box">

                  <input
                    type="date"
                    value={checkOut}
                    min={
                      checkIn ||
                      getToday()
                    }
                    onChange={
                      handleCheckOutChange
                    }
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                ADULTS
                ================================================= */}

            <div className="guest-field">

              <label>
                Adults
              </label>

              <div className="guest-box">

                <span>
                  <img src={AdultsImage} alt="" />
                </span>

                <select
                  value={adults}
                  onChange={(e) =>
                    setAdults(
                      Number(
                        e.target.value
                      )
                    )
                  }
                >

                  <option value="1">
                    1 Adult
                  </option>

                  <option value="2">
                    2 Adults
                  </option>

                  <option value="3">
                    3 Adults
                  </option>

                  <option value="4">
                    4 Adults
                  </option>

                  <option value="5">
                    5 Adults
                  </option>

                  <option value="6">
                    6 Adults
                  </option>

                </select>

              </div>

            </div>


            {/* =================================================
                CHILDREN
                ================================================= */}

            <div className="guest-field">

              <label>
                Children
              </label>

              <div className="guest-box">

                <span>
                  <img src={ChildImage} alt="" />
                </span>

                <select
                  value={children}
                  onChange={(e) =>
                    setChildren(
                      Number(
                        e.target.value
                      )
                    )
                  }
                >

                  <option value="0">
                    0 Children
                  </option>

                  <option value="1">
                    1 Child
                  </option>

                  <option value="2">
                    2 Children
                  </option>

                  <option value="3">
                    3 Children
                  </option>

                  <option value="4">
                    4 Children
                  </option>

                </select>

              </div>

            </div>


            {/* =================================================
                ROOMS
                ================================================= */}

            <div className="guest-field">

              <label>
                Rooms
              </label>

              <div className="guest-box">

                <span>
                  🛏
                </span>

                <select
                  value={rooms}
                  onChange={(e) =>
                    setRooms(
                      Number(
                        e.target.value
                      )
                    )
                  }
                >

                  <option value="1">
                    1 Room
                  </option>

                  <option value="2">
                    2 Rooms
                  </option>

                  <option value="3">
                    3 Rooms
                  </option>

                  <option value="4">
                    4 Rooms
                  </option>

                  <option value="5">
                    5 Rooms
                  </option>

                </select>

              </div>

            </div>


            {/* =================================================
                PRICE SUMMARY
                ================================================= */}

            <div className="booking-summary">

              <div className="price-row">

                <div>

                  <strong>
                    ₹
                    {pricePerNight.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <span>
                    / night
                  </span>

                </div>

              </div>


              {nights > 0 && (

                <>

                  <div className="summary-line">

                    <span>
                      ₹
                      {pricePerNight.toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {rooms} room
                      {rooms > 1
                        ? "s"
                        : ""}{" "}
                      × {nights} night
                      {nights > 1
                        ? "s"
                        : ""}
                    </span>

                    <strong>
                      ₹
                      {roomTotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>


                  <p className="taxes">

                    + ₹
                    {taxes.toLocaleString(
                      "en-IN"
                    )}{" "}
                    taxes & fees

                  </p>


                  <div className="total-row">

                    <span>
                      Total for {nights} night
                      {nights > 1
                        ? "s"
                        : ""}
                    </span>

                    <strong>
                      ₹
                      {grandTotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </>

              )}


              {nights === 0 && (

                <p className="select-date-message">

                  Select your check-in and
                  check-out dates to see the
                  total price.

                </p>

              )}


              {/* =================================================
                  CHECK AVAILABILITY
                  ================================================= */}

              <button
                type="button"
                className="availability-btn"
                onClick={
                  handleCheckAvailability
                }
                disabled={authLoading}
              >
                {authLoading
                  ? "Checking..."
                  : "Check Availability"}
              </button>


              {/* =================================================
                  CALL HOTEL
                  ================================================= */}

              {hotel.phone_number ? (

                hotel.call_status ===
                "available" ? (

                  <a
                    href={`tel:${hotel.phone_number}`}
                    className="call-hotel-btn"
                  >
                    ☎ Call Hotel
                  </a>

                ) : (

                  <button
                    type="button"
                    className="call-hotel-btn call-busy"
                    disabled
                  >
                    ☎ Currently Busy
                  </button>

                )

              ) : (

                <button
                  type="button"
                  className="call-hotel-btn call-disabled"
                  disabled
                >
                  ☎ Call Unavailable
                </button>

              )}


              {/* =================================================
                  CANCELLATION
                  ================================================= */}

              <div className="cancellation">

                <strong>
                  ✓ &nbsp; Free Cancellation
                </strong>

                <span>
                  Cancellation policy will be
                  shown during booking.
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* =====================================================
          IMAGE LIGHTBOX
          ===================================================== */}

      {selectedImage && (

        <div
          className="image-lightbox"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <button
            type="button"
            className="close-image"
            onClick={(e) => {

              e.stopPropagation();

              setSelectedImage(null);

            }}
          >
            ×
          </button>


          <img
            src={selectedImage}
            alt={hotel.name}
            onClick={(e) =>
              e.stopPropagation()
            }
          />

        </div>

      )}

    </>
  );
};

export default HotelDetails;