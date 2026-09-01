import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../Navbar.jsx";

import { createBooking, checkAvailability } from "../../apis/bookingApi.js";

import { useAuth } from "../../Context/AuthContext.jsx";

import "../../Styles/Booking.css";
import AdultsImage from "../../assets/user.png";
import ChildImage from "../../assets/icons8-children-50.png";
import LocationImage from "../../assets/location.png";
import LockImg from '../../assets/Lock.png'



const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  
  const { user, loading: authLoading } = useAuth();

 
  const hotel = location.state?.hotel || null;

  const bookingData = location.state?.bookingData || null;

  const availability = location.state?.availability || null;

 

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  

  useEffect(() => {
    
    if (authLoading) {
      return;
    }

  
    if (!user) {
      navigate("/login", {
        state: {
          from: "/booking",
          bookingData,
          hotel,
        },
        replace: true,
      });

      return;
    }
  }, [user, authLoading, navigate, bookingData, hotel]);

  

  useEffect(() => {
    if (!authLoading && user && (!hotel || !bookingData)) {
      navigate("/hotels");
    }
  }, [hotel, bookingData, navigate, authLoading, user]);



  if (authLoading) {
    return (
      <>
        <Navbar />

        <div className="booking-loading">
          <p>Loading booking...</p>
        </div>
      </>
    );
  }

 

  if (!user) {
    return null;
  }



  if (!hotel || !bookingData) {
    return null;
  }

  

  const {
    hotelId,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    nights,
    pricePerNight,
  } = bookingData;

  

  const price = Number(pricePerNight) || 0;

  const totalNights = Number(nights) || 0;

  const totalRooms = Number(rooms) || 1;

  const roomTotal = price * totalNights * totalRooms;

  const taxes = Math.round(roomTotal * 0.12);

  const grandTotal = roomTotal + taxes;



  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

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


  const handleConfirmBooking = async () => {
    setError("");
    setSuccess("");


    if (!user) {
      navigate("/login", {
        state: {
          from: "/booking",
          bookingData,
          hotel,
        },
      });

      return;
    }

    try {
      setLoading(true);

    

      const availabilityResponse = await checkAvailability({
        hotelId: Number(hotelId),

        checkIn,

        checkOut,

        rooms: Number(rooms),
      });

     

      if (
        !availabilityResponse.data?.success ||
        !availabilityResponse.data?.available
      ) {
        setError(
          availabilityResponse.data?.message ||
            "Rooms are not available for selected dates.",
        );

        return;
      }

     

      const payload = {
        hotelId: Number(hotelId),

        checkIn,

        checkOut,

        adults: Number(adults),

        children: Number(children || 0),

        rooms: Number(rooms),
      };



     

      const response = await createBooking(payload);



   

      if (response.data?.success) {
        setSuccess("Booking created successfully!");

        const booking = response.data.booking;

        setCreatedBooking(booking);

        setShowPayment(true);
      } else {
        setError(response.data?.message || "Failed to create booking.");
      }
    } catch (error) {
      console.log(
        "Create booking error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          "Failed to create booking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <Navbar />

      <main className="booking-page">
        {showPayment && createdBooking && (
          <div className="mock-payment-overlay">
            <div className="mock-payment-card">
              <button
                type="button"
                className="mock-payment-close"
                onClick={() => setShowPayment(false)}
              >
                ×
              </button>

              <div className="mock-payment-icon">₹</div>

              <h2>Complete Payment</h2>

              <p>Booking #{createdBooking.id}</p>

              <div className="mock-payment-amount">
                ₹{grandTotal.toLocaleString("en-IN")}
              </div>

              <p className="mock-payment-note">
                This is a test payment. Razorpay will be integrated later.
              </p>

              <button
                type="button"
                className="mock-pay-btn"
                onClick={() => {
                  setShowPayment(false);

                  navigate(`/booking-success/${createdBooking.id}`, {
                    state: {
                      booking: createdBooking,
                      hotel,
                    },
                  });
                }}
              >
                Pay ₹{grandTotal.toLocaleString("en-IN")}
              </button>

              <button
                type="button"
                className="mock-cancel-btn"
                onClick={() => setShowPayment(false)}
              >
                Cancel Payment
              </button>
            </div>
          </div>
        )}
        
        <div className="booking-page-header">
          <button
            type="button"
            className="booking-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div>
            <h1>Confirm Your Booking</h1>

            <p>Review your stay details before confirming.</p>
          </div>
        </div>


        {error && <div className="booking-error">{error}</div>}


        {success && <div className="booking-success">{success}</div>}

        <div className="booking-layout">


          <section className="booking-left">


            <div className="booking-hotel-card">
              <div className="booking-hotel-image">
                {hotel.images?.length > 0 ? (
                  <img src={hotel.images[0].url} alt={hotel.name} />
                ) : (
                  <div className="booking-no-image">🏨</div>
                )}
              </div>

              <div className="booking-hotel-info">
                <div className="booking-hotel-rating">
                  ★ {Number(hotel.rating || 0).toFixed(1)}
                </div>

                <h2>{hotel.name}</h2>

                <p><img src={LocationImage} alt="" /> {hotel.location}</p>
              </div>
            </div>

       

            <div className="booking-section">
              <h2>Your Stay</h2>

              <div className="stay-grid">
                <div className="stay-item">
                  <span>Check-in</span>

                  <strong>{formatDate(checkIn)}</strong>
                </div>

                <div className="stay-item">
                  <span>Check-out</span>

                  <strong>{formatDate(checkOut)}</strong>
                </div>

                <div className="stay-item">
                  <span>Duration</span>

                  <strong>
                    {totalNights} night
                    {totalNights > 1 ? "s" : ""}
                  </strong>
                </div>

                <div className="stay-item">
                  <span>Rooms</span>

                  <strong>
                    {totalRooms} room
                    {totalRooms > 1 ? "s" : ""}
                  </strong>
                </div>
              </div>
            </div>

         

            <div className="booking-section">
              <h2>Guests</h2>

              <div className="guest-summary">
                <div className="guest-summary-item">
                  <span><img src={AdultsImage} alt="" /></span>

                  <div>
                    <strong>
                      {adults} Adult
                      {Number(adults) > 1 ? "s" : ""}
                    </strong>

                    <small>Main guests</small>
                  </div>
                </div>

                <div className="guest-summary-item">
                  <span><img src={ChildImage} alt="" /></span>

                  <div>
                    <strong>
                      {children} Child
                      {Number(children) !== 1 ? "ren" : ""}
                    </strong>

                    <small>Children</small>
                  </div>
                </div>

                <div className="guest-summary-item">
                  <span>🛏</span>

                  <div>
                    <strong>
                      {totalRooms} Room
                      {totalRooms > 1 ? "s" : ""}
                    </strong>

                    <small>Rooms booked</small>
                  </div>
                </div>
              </div>
            </div>

           

            <div className="booking-section">
              <h2>Hotel Amenities</h2>

              {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 ? (
                <div className="booking-amenities">
                  {hotel.amenities.map((amenity, index) => (
                    <span key={index} className="booking-amenity">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-booking-amenities">No amenities listed.</p>
              )}
            </div>

           

            <div className="booking-policy">
              <div className="policy-icon">✓</div>

              <div>
                <strong>Free Cancellation</strong>

                <p>
                  Your cancellation policy will depend on the booking terms.
                </p>
              </div>
            </div>
          </section>

       
          <aside className="booking-right">
            <div className="booking-price-card">
              <h2>Price Summary</h2>

             

              <div className="price-summary-row">
                <span>
                  ₹{price.toLocaleString("en-IN")}
                  {" × "}
                  {totalRooms} room
                  {totalRooms > 1 ? "s" : ""}
                  {" × "}
                  {totalNights} night
                  {totalNights > 1 ? "s" : ""}
                </span>

                <strong>₹{roomTotal.toLocaleString("en-IN")}</strong>
              </div>


              <div className="price-summary-row">
                <span>Taxes & fees</span>

                <strong>₹{taxes.toLocaleString("en-IN")}</strong>
              </div>

              

              <div className="price-divider"></div>

            

              <div className="price-total-row">
                <span>Total</span>

                <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
              </div>

            

              {availability && (
                <div className="availability-info">
                  <strong>✓ Rooms available</strong>

                  <span>
                    {availability.availableRooms} room
                    {Number(availability.availableRooms) !== 1 ? "s" : ""}{" "}
                    available
                  </span>
                </div>
              )}


              <button
                type="button"
                className="confirm-booking-btn"
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? "Creating Booking..." : "Confirm Booking"}
              </button>

              <p className="secure-booking-text"><img src={LockImg} alt="" /> Secure booking</p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Booking;
