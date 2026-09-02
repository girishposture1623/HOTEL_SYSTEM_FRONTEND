import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../apis/api.js";
import "../../Styles/HotelDetails.css";
import LocationImage from "../../assets/location.png";
import Navbar from "../Navbar.jsx";

import { useAuth } from "../../Context/AuthContext.jsx";
import AdultsImage from "../../assets/user.png";
import ChildImage from "../../assets/icons8-children-50.png";
import BedImg from "../../assets/about/single-bed.png";
import SqureFeetImg from "../../assets/about/square.png";
import Loader from "../../components/Loader.jsx";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const { user, loading: authLoading } = useAuth();

  const [hotel, setHotel] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedHotelImages, setSelectedHotelImages] = useState([]);
  const [selectedHotelImageIndex, setSelectedHotelImageIndex] = useState(0);

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [adults, setAdults] = useState(2);

  const [children, setChildren] = useState(0);

  const [rooms, setRooms] = useState(1);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);

  const [selectedRoomImageIndex, setSelectedRoomImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [visibleRooms, setVisibleRooms] = useState(9);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/hotel/hotels/${id}`);

        setHotel(response.data?.hotel);

        const roomResponse = await api.get(`/hotel/hotels/${id}/rooms`);

        setHotelRooms(roomResponse.data?.rooms || []);
      } catch (error) {
        console.log(
          "Get hotel details error:",
          error.response?.data || error.message,
        );

        setError(error.response?.data?.message || "Failed to load hotel");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotel();
    }
  }, [id]);

  useEffect(() => {
    const fetchRoomsByDate = async () => {
      if (!id) {
        return;
      }

      if (!checkIn || !checkOut) {
        return;
      }

      try {
        const response = await api.get(`/hotel/hotels/${id}/rooms`, {
          params: {
            checkIn,
            checkOut,
          },
        });

        const rooms = response.data?.rooms || [];

        setHotelRooms(rooms);

        // Selected room unavailable झाल्यास selection काढा
        setSelectedRoom((currentRoom) => {
          if (!currentRoom) {
            return null;
          }

          const updatedRoom = rooms.find(
            (room) => Number(room.id) === Number(currentRoom.id),
          );

          if (!updatedRoom || !updatedRoom.room_available) {
            return null;
          }

          return updatedRoom;
        });
      } catch (error) {
        console.log(
          "Date-wise room availability error:",
          error.response?.data || error.message,
        );
      }
    };

    fetchRoomsByDate();
  }, [id, checkIn, checkOut]);
  // =====================================================
  // DATE HELPERS
  // =====================================================

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);

    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  // =====================================================
  // PRICE
  // =====================================================

  const pricePerNight = Number(
    selectedRoom?.price_per_night ??
      selectedRoom?.pricePerNight ??
      hotel?.price_per_night ??
      hotel?.pricePerNight ??
      0,
  );

  const nights = calculateNights();

  const roomTotal = pricePerNight * nights * rooms;

  const taxes = Math.round(roomTotal * 0.12);

  const grandTotal = roomTotal + taxes;

  // =====================================================
  // CHECK-IN CHANGE
  // =====================================================

  const handleCheckInChange = (e) => {
    const value = e.target.value;

    setCheckIn(value);

    if (checkOut && value >= checkOut) {
      setCheckOut("");
    }
  };

  // =====================================================
  // CHECK-OUT CHANGE
  // =====================================================

  const handleCheckOutChange = (e) => {
    const value = e.target.value;

    if (checkIn && value <= checkIn) {
      alert("Check-out date must be after check-in date.");

      return;
    }

    setCheckOut(value);
  };

  // =====================================================
  // CHECK AVAILABILITY
  // =====================================================

  const handleCheckAvailability = () => {
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
      alert("Please login to check availability.");

      navigate("/login", {
        state: {
          from: `/hotelsDitails/${id}`,
        },
      });

      return;
    }

    // =================================================
    // DATE VALIDATION
    // =================================================

    if (!checkIn) {
      alert("Please select check-in date.");

      return;
    }

    if (!checkOut) {
      alert("Please select check-out date.");

      return;
    }

    if (nights <= 0) {
      alert("Please select valid dates.");

      return;
    }

    // =================================================
    // ROOM VALIDATION
    // =================================================

    if (rooms < 1) {
      alert("Please select at least one room.");

      return;
    }

    if (!selectedRoom) {
      alert("Please select a room.");

      return;
    }

    // =================================================
    // BOOKING DATA
    // =================================================

    // =================================================
    // GO TO BOOKING
    // =================================================

    navigate("/booking", {
      state: {
        hotel,

        bookingData: {
          hotelId: id,
          roomId: selectedRoom.id,
          roomNumber: selectedRoom.room_number,
          roomType: selectedRoom.room_type,
          roomImages: selectedRoom.images || [],
          capacity: selectedRoom.capacity,
          bedType: selectedRoom.bed_type,
          roomSize: selectedRoom.room_size,
          description: selectedRoom.description,
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
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <Loader />
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
          <h2>{error}</h2>

          <button type="button" onClick={() => navigate(-1)}>
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
          <h2>Hotel not found</h2>

          <button type="button" onClick={() => navigate("/hotels")}>
            Back to Hotels
          </button>
        </div>
      </>
    );
  }

  // =====================================================
  // HOTEL IMAGES
  // =====================================================

  const images = Array.isArray(hotel.images) ? hotel.images : [];

  // =====================================================
  // AMENITIES
  // =====================================================

  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

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
              <strong>★ {Number(hotel.rating || 0).toFixed(1)}</strong>

              <span>/ 5</span>
            </div>

            <div className="title">
              <h3>{hotel.name}</h3>
            </div>

            <div className="location">
              <img src={LocationImage} alt="Location" />

              <span>{hotel.location}</span>
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
                  onClick={() => {
                    setSelectedHotelImages(images);
                    setSelectedHotelImageIndex(0);
                  }}
                />

                <span className="image-count">1 / {images.length}</span>
              </div>

              {/* SIDE IMAGES */}
              <div className="gallery-side">
                {images.slice(1, 5).map((image, index) => {
                  const isLastImage = index === 3 && images.length > 5;

                  return (
                    <div
                      className="gallery-small"
                      key={image.id || image.public_id || index}
                    >
                      <img
                        src={image.url}
                        alt={`${hotel.name} ${index + 2}`}
                        onClick={() => {
                          setSelectedHotelImages(images);
                          setSelectedHotelImageIndex(index + 1);
                        }}
                      />

                      {isLastImage && (
                        <div
                          className="view-all-overlay"
                          onClick={() => {
                            setSelectedHotelImages(images);
                            setSelectedHotelImageIndex(index + 1);
                          }}
                        >
                          <strong>+{images.length - 5}</strong>
                          <span>View all photos</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="hotel-no-images">No images available</div>
          )}
          {/* =================================================
              ABOUT HOTEL
              ================================================= */}

          <div className="disc">
            <h4>About This Hotel</h4>

            <p>
              {hotel.description || "No description available for this hotel."}
            </p>
          </div>

          {/* =================================================
              AMENITIES
              ================================================= */}

          <div className="amenities">
            <h4>Amenities</h4>

            {amenities.length > 0 ? (
              <div className="amenities-list">
                {amenities.map((amenity, index) => (
                  <div className="amenity-item" key={`${hotel.id}-${index}`}>
                    {amenity}
                  </div>
                ))}
              </div>
            ) : (
              <p>No amenities available</p>
            )}
          </div>
          <div className="hotel-rooms-section">
            <div className="rooms-section-header">
              <h4>Available Rooms</h4>

              <span>
                {hotelRooms.length} {hotelRooms.length === 1 ? "Room" : "Rooms"}
              </span>
            </div>

            {hotelRooms.length > 0 ? (
              <div className="hotel-rooms-list">
                {hotelRooms.slice(0, visibleRooms).map((room) => {
                  const roomImages = Array.isArray(room.images)
                    ? room.images
                    : [];

                  const roomImage =
                    roomImages[0]?.url || roomImages[0]?.image_url || null;

                  const price = Number(
                    room.price_per_night ?? room.pricePerNight ?? 0,
                  );

                  return (
                    <div
                      className={`hotel-room-card ${
                        selectedRoom?.id === room.id ? "selected-room" : ""
                      }`}
                      key={room.id}
                    >
                      <div
                        className="hotel-room-image"
                        onClick={() => {
                          if (roomImages.length > 0) {
                            setSelectedRoomImages(roomImages);
                            setSelectedRoomImageIndex(0);
                          }
                        }}
                      >
                        {roomImage ? (
                          <img src={roomImage} alt={room.room_type || "Room"} />
                        ) : (
                          <div className="room-no-image">🛏</div>
                        )}
                      </div>

                      <div className="hotel-room-info">
                        <div className="hotel-room-top">
                          <div>
                            <h3>{room.room_type || "Room"}</h3>

                            <span className="room-number">
                              Room {room.room_number}
                            </span>
                          </div>

                          <div className="room-price">
                            <strong>₹{price.toLocaleString("en-IN")}</strong>

                            <span>/ night</span>
                          </div>
                        </div>

                        <div className="room-details">
                          <span>
                            <img src={AdultsImage} alt="" /> {room.capacity}{" "}
                            Guests
                          </span>

                          {room.bed_type && (
                            <span>
                              <img src={BedImg} alt="" /> {room.bed_type}
                            </span>
                          )}

                          {room.room_size && (
                            <span>
                              <img src={SqureFeetImg} alt="" /> {room.room_size}
                            </span>
                          )}
                        </div>

                        {room.description && (
                          <p className="room-description">{room.description}</p>
                        )}

                        <div className="room-bottom">
                          <span
                            className={`room-status ${
                              room.is_booked
                                ? "booked"
                                : room.status === "available"
                                  ? "available"
                                  : "unavailable"
                            }`}
                          >
                            {room.is_booked
                              ? "Booked"
                              : room.status === "available"
                                ? "Available"
                                : "Not Available"}
                          </span>

                          <button
                            type="button"
                            className={`room-select-btn ${
                              selectedRoom?.id === room.id ? "selected" : ""
                            }`}
                            onClick={() => {
                              if (selectedRoom?.id === room.id) {
                                setSelectedRoom(null);
                              } else {
                                setSelectedRoom(room);
                              }
                            }}
                            disabled={
                              room.status !== "available" ||
                              room.is_booked ||
                              !room.room_available
                            }
                          >
                            {selectedRoom?.id === room.id
                              ? "Selected"
                              : room.is_booked
                                ? "Booked"
                                : room.status !== "available"
                                  ? "Not Available"
                                  : "Select Room"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {visibleRooms < hotelRooms.length && (
                  <div className="rooms-load-more">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleRooms((prev) =>
                          Math.min(prev + 9, hotelRooms.length),
                        )
                      }
                    >
                      Load More
                    </button>

                    <span>
                      Showing {Math.min(visibleRooms, hotelRooms.length)} of{" "}
                      {hotelRooms.length} rooms
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-rooms-message">
                <span>
                  <img src={BedImg} alt="" />
                </span>
                <p>No rooms available for this hotel.</p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            SECTION 2 - BOOKING
            ===================================================== */}

        <section className="section2">
          <div className="booking-card">
            <h2>Book Your Stay</h2>

            {selectedRoom && (
              <div className="selected-room-info">
                <strong>{selectedRoom.room_type}</strong>
                <span>Room {selectedRoom.room_number}</span>
                <span>
                  ₹
                  {Number(
                    selectedRoom.price_per_night ??
                      selectedRoom.pricePerNight ??
                      0,
                  ).toLocaleString("en-IN")}{" "}
                  / night
                </span>
              </div>
            )}
            {/* =================================================
                DATES
                ================================================= */}

            <div className="date-row">
              <div className="date-field">
                <label>Check-in</label>

                <div className="input-box">
                  <input
                    type="date"
                    value={checkIn}
                    min={getToday()}
                    onChange={handleCheckInChange}
                  />
                </div>
              </div>

              <div className="date-field">
                <label>Check-out</label>

                <div className="input-box">
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || getToday()}
                    onChange={handleCheckOutChange}
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                ADULTS
                ================================================= */}

            <div className="guest-field">
              <label>Adults</label>

              <div className="guest-box">
                <span>
                  <img src={AdultsImage} alt="" />
                </span>

                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                >
                  <option value="1">1 Adult</option>

                  <option value="2">2 Adults</option>

                  <option value="3">3 Adults</option>

                  <option value="4">4 Adults</option>

                  <option value="5">5 Adults</option>

                  <option value="6">6 Adults</option>
                </select>
              </div>
            </div>

            {/* =================================================
                CHILDREN
                ================================================= */}

            <div className="guest-field">
              <label>Children</label>

              <div className="guest-box">
                <span>
                  <img src={ChildImage} alt="" />
                </span>

                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                >
                  <option value="0">0 Children</option>

                  <option value="1">1 Child</option>

                  <option value="2">2 Children</option>

                  <option value="3">3 Children</option>

                  <option value="4">4 Children</option>
                </select>
              </div>
            </div>

            {/* =================================================
                ROOMS
                ================================================= */}

            <div className="guest-field">
              <label>Rooms</label>

              <div className="guest-box">
                <span>
                  <img src={BedImg} alt="" />
                </span>

                <select
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                >
                  <option value="1">1 Room</option>

                  <option value="2">2 Rooms</option>

                  <option value="3">3 Rooms</option>

                  <option value="4">4 Rooms</option>

                  <option value="5">5 Rooms</option>
                </select>
              </div>
            </div>

            {/* =================================================
                PRICE SUMMARY
                ================================================= */}

            <div className="booking-summary">
              <div className="price-row">
                <div>
                  <strong>₹{pricePerNight.toLocaleString("en-IN")}</strong>

                  <span>/ night</span>
                </div>
              </div>

              {nights > 0 && (
                <>
                  <div className="summary-line">
                    <span>
                      ₹{pricePerNight.toLocaleString("en-IN")} × {rooms} room
                      {rooms > 1 ? "s" : ""} × {nights} night
                      {nights > 1 ? "s" : ""}
                    </span>

                    <strong>₹{roomTotal.toLocaleString("en-IN")}</strong>
                  </div>

                  <p className="taxes">
                    + ₹{taxes.toLocaleString("en-IN")} taxes & fees
                  </p>

                  <div className="total-row">
                    <span>
                      Total for {nights} night
                      {nights > 1 ? "s" : ""}
                    </span>

                    <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
                  </div>
                </>
              )}

              {nights === 0 && (
                <p className="select-date-message">
                  Select your check-in and check-out dates to see the total
                  price.
                </p>
              )}

              {/* =================================================
                  CHECK AVAILABILITY
                  ================================================= */}

              <button
                type="button"
                className="availability-btn"
                onClick={handleCheckAvailability}
                disabled={authLoading}
              >
                {authLoading ? "Checking..." : "Check Availability"}
              </button>

              {/* =================================================
                  CALL HOTEL
                  ================================================= */}

              {hotel?.phone_number ? (
                hotel.call_status === "available" ? (
                  <a
                    href={`tel:${hotel?.phone_number}`}
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
                <strong>✓ &nbsp; Free Cancellation</strong>

                <span>Cancellation policy will be shown during booking.</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          IMAGE LIGHTBOX
          ===================================================== */}

      {selectedHotelImages.length > 0 && (
        <div
          className="hotel-gallery-viewer"
          onClick={() => {
            setSelectedHotelImages([]);
            setSelectedHotelImageIndex(0);
          }}
        >
          <button
            type="button"
            className="hotel-gallery-close"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedHotelImages([]);
              setSelectedHotelImageIndex(0);
            }}
          >
            ×
          </button>

          {selectedHotelImageIndex > 0 && (
            <button
              type="button"
              className="hotel-gallery-nav hotel-gallery-prev"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotelImageIndex((prev) => prev - 1);
              }}
            >
              ‹
            </button>
          )}

          <img
            className="hotel-gallery-image"
            src={
              selectedHotelImages[selectedHotelImageIndex]?.url ||
              selectedHotelImages[selectedHotelImageIndex]?.image_url
            }
            alt={hotel.name}
            onClick={(e) => e.stopPropagation()}
          />

          {selectedHotelImageIndex < selectedHotelImages.length - 1 && (
            <button
              type="button"
              className="hotel-gallery-nav hotel-gallery-next"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotelImageIndex((prev) => prev + 1);
              }}
            >
              ›
            </button>
          )}

          <div
            className="hotel-gallery-thumbs"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedHotelImages.map((image, index) => (
              <img
                key={image.id || image.public_id || index}
                src={image.url || image.image_url}
                alt={`${hotel.name} ${index + 1}`}
                className={
                  index === selectedHotelImageIndex
                    ? "hotel-gallery-thumb active"
                    : "hotel-gallery-thumb"
                }
                onClick={() => setSelectedHotelImageIndex(index)}
              />
            ))}
          </div>

          <span className="hotel-gallery-counter">
            {selectedHotelImageIndex + 1} / {selectedHotelImages.length}
          </span>
        </div>
      )}
      {selectedRoomImages.length > 0 && (
        <div
          className="room-gallery-viewer"
          onClick={() => {
            setSelectedRoomImages([]);
            setSelectedRoomImageIndex(0);
          }}
        >
          <button
            type="button"
            className="room-gallery-close"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRoomImages([]);
              setSelectedRoomImageIndex(0);
            }}
          >
            ×
          </button>

          {selectedRoomImageIndex > 0 && (
            <button
              type="button"
              className="room-gallery-nav room-gallery-prev"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRoomImageIndex((prev) => prev - 1);
              }}
            >
              ‹
            </button>
          )}

          <img
            className="room-gallery-image"
            src={
              selectedRoomImages[selectedRoomImageIndex]?.url ||
              selectedRoomImages[selectedRoomImageIndex]?.image_url
            }
            alt="Room"
            onClick={(e) => e.stopPropagation()}
          />

          {selectedRoomImageIndex < selectedRoomImages.length - 1 && (
            <button
              type="button"
              className="room-gallery-nav room-gallery-next"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRoomImageIndex((prev) => prev + 1);
              }}
            >
              ›
            </button>
          )}

          <div
            className="room-gallery-thumbs"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedRoomImages.map((image, index) => (
              <img
                key={image.id || index}
                src={image.url || image.image_url}
                alt={`Room ${index + 1}`}
                className={
                  index === selectedRoomImageIndex
                    ? "room-gallery-thumb active"
                    : "room-gallery-thumb"
                }
                onClick={() => setSelectedRoomImageIndex(index)}
              />
            ))}
          </div>

          <span className="room-gallery-counter">
            {selectedRoomImageIndex + 1} / {selectedRoomImages.length}
          </span>
        </div>
      )}
    </>
  );
};

export default HotelDetails;
