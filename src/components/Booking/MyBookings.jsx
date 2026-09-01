import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from '../../components/Loader.jsx'

import Navbar from "../Navbar.jsx";

import { getMyBookings, cancelBooking } from "../../apis/bookingApi.js";

import LocationImg from '../../assets/location.png'
import "../../Styles/MyBooking.css"

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [cancelLoading, setCancelLoading] = useState(null);

  const [error, setError] = useState("");

  

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyBookings();

   

      setBookings(response.data?.bookings || []);
    } catch (error) {
      console.log(
        "Get my bookings error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message || "Failed to load your bookings.",
      );
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchBookings();
  }, []);

  

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

 

  const formatPrice = (price) => {
    return (Number(price) || 0).toLocaleString("en-IN");
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

 

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelLoading(bookingId);

      setError("");

      const response = await cancelBooking(bookingId);

    

      if (response.data?.success) {
        // Refresh bookings
        await fetchBookings();

        alert("Booking cancelled successfully.");
      }
    } catch (error) {
      console.log(
        "Cancel booking error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancelLoading(null);
    }
  };

  

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "confirmed") {
      return "status-confirmed";
    }

    if (value === "cancelled") {
      return "status-cancelled";
    }

    if (value === "expired") {
      return "status-expired";
    }

    return "status-pending";
  };

  

  const getPaymentClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid") {
      return "payment-paid";
    }

    if (value === "failed") {
      return "payment-failed";
    }

    return "payment-pending";
  };

 

  if (loading) {
    return <Loader/>
  }

 

  if (error && bookings.length === 0) {
    return (
      <>
        <Navbar />

        <main className="my-bookings-page">
          <div className="my-bookings-header">
            <h1>My Bookings</h1>

            <p>Manage your hotel bookings.</p>
          </div>

          <div className="my-bookings-error">
            <div className="error-icon">!</div>

            <h2>Unable to load bookings</h2>

            <p>{error}</p>

            <button type="button" onClick={fetchBookings}>
              Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

  

  return (
    <>
      <Navbar />

      <main className="my-bookings-page">
      

        <div className="my-bookings-header">
          <div>
            <h1>My Bookings</h1>

            <p>View and manage all your hotel bookings.</p>
          </div>

          <button
            type="button"
            className="browse-hotels-btn"
            onClick={() => navigate("/hotels")}
          >
            Browse Hotels
          </button>
        </div>


        {error && <div className="my-bookings-inline-error">{error}</div>}

      

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">🏨</div>

            <h2>No bookings yet</h2>

            <p>You haven't made any hotel bookings yet.</p>

            <button type="button" onClick={() => navigate("/hotels")}>
              Find a Hotel
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const nights = getNights(booking.check_in, booking.check_out);

              const bookingStatus = booking.booking_status || "pending";

              const paymentStatus = booking.payment_status || "pending";

              return (
                <article className="my-booking-card" key={booking.id}>
               

                  <div className="my-booking-image">
                    {booking.hotel_image ? (
                      <img src={booking.hotel_image} alt={booking.hotel_name} />
                    ) : (
                      <div className="booking-image-placeholder">🏨</div>
                    )}
                  </div>

                

                  <div className="my-booking-content">
                  

                    <div className="booking-card-top">
                      <div>
                        <h2>{booking.hotel_name || "Hotel"}</h2>

                        <p className="booking-location">
                          <img src={LocationImg} alt="" /> {booking.hotel_location || "Location unavailable"}
                        </p>
                      </div>

                      <div className="booking-status-area">
                        <span
                          className={`booking-status ${getStatusClass(
                            bookingStatus,
                          )}`}
                        >
                          {bookingStatus}
                        </span>

                        <span
                          className={`payment-status ${getPaymentClass(
                            paymentStatus,
                          )}`}
                        >
                          Payment: {paymentStatus}
                        </span>
                      </div>
                    </div>

                   

                    <div className="booking-details-grid">
                      <div className="booking-detail">
                        <span>Check-in</span>

                        <strong>{formatDate(booking.check_in)}</strong>
                      </div>

                      <div className="booking-detail">
                        <span>Check-out</span>

                        <strong>{formatDate(booking.check_out)}</strong>
                      </div>

                      <div className="booking-detail">
                        <span>Guests</span>

                        <strong>
                          {Number(booking.adults || 0)} Adults
                          {Number(booking.children || 0) > 0 &&
                            `, ${booking.children} Children`}
                        </strong>
                      </div>

                      <div className="booking-detail">
                        <span>Rooms</span>

                        <strong>
                          {Number(booking.rooms_booked || 0)} Room
                          {Number(booking.rooms_booked) !== 1 ? "s" : ""}
                        </strong>
                      </div>

                      <div className="booking-detail">
                        <span>Duration</span>

                        <strong>
                          {nights} Night
                          {nights !== 1 ? "s" : ""}
                        </strong>
                      </div>

                      <div className="booking-detail">
                        <span>Booking ID</span>

                        <strong>#{booking.id}</strong>
                      </div>
                    </div>


                    <div className="booking-card-bottom">
                      <div className="booking-price">
                        <span>Total Amount</span>

                        <strong>₹{formatPrice(booking.total_price)}</strong>
                      </div>

                      <div className="booking-actions">
                        <button
                          type="button"
                          className="view-booking-btn"
                          onClick={() => navigate(`/booking/${booking.id}`)}
                        >
                          View Details
                        </button>

                        {["pending", "confirmed"].includes(
                          String(bookingStatus).toLowerCase(),
                        ) && (
                          <button
                            type="button"
                            className="cancel-booking-btn"
                            disabled={cancelLoading === booking.id}
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            {cancelLoading === booking.id
                              ? "Cancelling..."
                              : "Cancel Booking"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default MyBookings;
