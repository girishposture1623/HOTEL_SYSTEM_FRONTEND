import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../Navbar.jsx";

import { getBookingById, cancelBooking } from "../../apis/bookingApi.js";
import api from "../../apis/api.js";
import "../../Styles/BookingDetails.css";
import AdultsImage from "../../assets/user.png";
import ChildImage from "../../assets/icons8-children-50.png";
import LocationImage from "../../assets/location.png";


const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  const [cancelLoading, setCancelLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookingById(id);



      setBooking(response.data?.booking || null);
    } catch (error) {
      console.log(
        "Get booking details error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message || "Failed to load booking details.",
      );
    } finally {
      setLoading(false);
    }
  };

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
    fetchBooking();
  }, [id]);

 

  const formatDate = (date) => {
    if (!date) return "-";

    const dateObject = new Date(date);

    if (Number.isNaN(dateObject.getTime())) {
      return date;
    }

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getNights = (checkIn, checkOut) => {
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

  const formatPrice = (price) => {
    return (Number(price) || 0).toLocaleString("en-IN");
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "confirmed") {
      return "details-status-confirmed";
    }

    if (value === "cancelled") {
      return "details-status-cancelled";
    }

    if (value === "expired") {
      return "details-status-expired";
    }

    return "details-status-pending";
  };

  const getPaymentClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid") {
      return "details-payment-paid";
    }

    if (value === "failed") {
      return "details-payment-failed";
    }

    return "details-payment-pending";
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelLoading(true);

      const response = await cancelBooking(id);

      

      if (response.data?.success) {
        alert("Booking cancelled successfully.");

        await fetchBooking();
      }
    } catch (error) {
      console.log(
        "Cancel booking error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="booking-details-loading">
          <div className="booking-details-spinner"></div>

          <p>Loading booking details...</p>
        </div>
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />

        <main className="booking-details-page">
          <div className="booking-details-error">
            <div className="details-error-icon">!</div>

            <h2>Booking Not Found</h2>

            <p>{error || "This booking could not be found."}</p>

            <button type="button" onClick={() => navigate("/my-bookings")}>
              Back to My Bookings
            </button>
          </div>
        </main>
      </>
    );
  }

  const nights = getNights(booking.check_in, booking.check_out);

  const rooms = Number(booking.rooms_booked || 0);

  const adults = Number(booking.adults || 0);

  const children = Number(booking.children || 0);

  const pricePerNight = Number(booking.price_per_night || 0);

  const totalPrice = Number(booking.total_price || 0);

  const bookingStatus = booking.booking_status || "pending";

  const paymentStatus = booking.payment_status || "pending";

  return (
    <>
      <Navbar />

      <main className="booking-details-page">
        <div className="booking-details-header">
          <button
            type="button"
            className="details-back-btn"
            onClick={() => navigate("/my-bookings")}
          >
            ← My Bookings
          </button>

          <div>
            <h1>Booking Details</h1>

            <p>Booking #{booking.id}</p>
          </div>
        </div>

        <div className="details-status-card">
          <div className="details-success-icon">✓</div>

          <div className="details-status-text">
            <h2>Booking Information</h2>

            <p>Your booking details are shown below.</p>
          </div>

          <div className="details-status-badges">
            <span className={`details-status ${getStatusClass(bookingStatus)}`}>
              {bookingStatus}
            </span>

            <span
              className={`details-payment ${getPaymentClass(paymentStatus)}`}
            >
              Payment: {paymentStatus}
            </span>
          </div>
        </div>

        <div className="booking-details-layout">
          <section className="booking-details-main">
            <div className="details-section">
              <h2>Hotel Information</h2>

              <div className="details-hotel">
                <div className="details-hotel-image">
                  {booking.hotel_image ? (
                    <img
                      src={booking.hotel_image}
                      alt={booking.hotel_name || "Hotel"}
                    />
                  ) : (
                    <div className="hotel-image-placeholder">🏨</div>
                  )}
                </div>

                <div>
                  <h3>{booking.hotel_name || "Hotel"}</h3>

                  <p><img src={LocationImage} alt="" /> {booking.hotel_location || "Location unavailable"}</p>
                </div>
              </div>
            </div>

          

            <div className="details-section">
              <h2>Stay Details</h2>

              <div className="details-grid">
                <div className="details-item">
                  <span>Check-in</span>

                  <strong>{formatDate(booking.check_in)}</strong>
                </div>

                <div className="details-item">
                  <span>Check-out</span>

                  <strong>{formatDate(booking.check_out)}</strong>
                </div>

                <div className="details-item">
                  <span>Duration</span>

                  <strong>
                    {nights} Night
                    {nights !== 1 ? "s" : ""}
                  </strong>
                </div>

                <div className="details-item">
                  <span>Rooms</span>

                  <strong>
                    {rooms} Room
                    {rooms !== 1 ? "s" : ""}
                  </strong>
                </div>
              </div>
            </div>

         

            <div className="details-section">
              <h2>Guest Information</h2>

              <div className="details-guests">
                <div>
                  <span className="details-guest-icon"><img src={AdultsImage} alt="" /></span>

                  <div>
                    <span>Adults</span>

                    <strong>{adults}</strong>
                  </div>
                </div>

                <div>
                  <span className="details-guest-icon"><img src={ChildImage} alt="" /></span>

                  <div>
                    <span>Children</span>

                    <strong>{children}</strong>
                  </div>
                </div>

                <div>
                  <span className="details-guest-icon">🛏</span>

                  <div>
                    <span>Rooms</span>

                    <strong>{rooms}</strong>
                  </div>
                </div>
              </div>
            </div>

           

            <div className="details-section">
              <h2>Booking Information</h2>

              <div className="booking-info-list">
                <div>
                  <span>Booking ID</span>

                  <strong>#{booking.id}</strong>
                </div>

                <div>
                  <span>Booking Date</span>

                  <strong>{formatDate(booking.created_at)}</strong>
                </div>

                <div>
                  <span>Booking Status</span>

                  <strong
                    className={`text-status ${getStatusClass(bookingStatus)}`}
                  >
                    {bookingStatus}
                  </strong>
                </div>

                <div>
                  <span>Payment Status</span>

                  <strong
                    className={`text-status ${getPaymentClass(paymentStatus)}`}
                  >
                    {paymentStatus}
                  </strong>
                </div>
              </div>
            </div>
          </section>

         

          <aside className="booking-details-sidebar">
            <div className="details-price-card">
              <h2>Price Summary</h2>

              <div className="details-price-row">
                <span>
                  ₹{formatPrice(pricePerNight)} × {rooms} room
                  {rooms !== 1 ? "s" : ""}
                </span>

                <strong>₹{formatPrice(pricePerNight * rooms)}</strong>
              </div>

              <div className="details-price-row">
                <span>
                  {nights} night
                  {nights !== 1 ? "s" : ""}
                </span>

                <strong>₹{formatPrice(totalPrice)}</strong>
              </div>

              <div className="details-divider"></div>

              <div className="details-total-row">
                <span>Total Amount</span>

                <strong>₹{formatPrice(totalPrice)}</strong>
              </div>

              {/* CANCEL */}

              {["pending", "confirmed"].includes(
                String(bookingStatus).toLowerCase(),
              ) && (
                <button
                  type="button"
                  className="details-cancel-btn"
                  disabled={cancelLoading}
                  onClick={handleCancel}
                >
                  {cancelLoading ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}

              <button
                type="button"
                className="details-hotels-btn"
                onClick={() => navigate("/hotels")}
              >
                Browse More Hotels
              </button>
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
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default BookingDetails;
