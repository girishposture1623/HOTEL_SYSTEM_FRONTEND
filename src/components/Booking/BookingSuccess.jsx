import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../Navbar.jsx";

import {
  createPaymentOrder,
  verifyPayment,
  paymentFailed,
} from "../../apis/paymentApi.js";

import "../../Styles/BookingSuccess.css";

import LocationImage from "../../assets/location.png";
import AdultsImage from "../../assets/user.png";
import ChildImage from "../../assets/icons8-children-50.png";


const BookingSuccess = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { id } = useParams();


  // =====================================================
  // BOOKING DATA
  // =====================================================

  const booking = location.state?.booking;
  const hotel = location.state?.hotel;


  // =====================================================
  // PAYMENT SUCCESS STATE
  // =====================================================

  const [paymentSuccess, setPaymentSuccess] =
    useState(
      location.state?.paymentSuccess || false
    );


  const [paymentId, setPaymentId] =
    useState(
      location.state?.paymentId || ""
    );


  // =====================================================
  // PAYMENT LOADING
  // =====================================================

  const [paymentLoading, setPaymentLoading] =
    useState(false);


  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================

  useEffect(() => {

    if (window.Razorpay) {
      return;
    }


    const script =
      document.createElement("script");


    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";


    script.async = true;


    script.onload = () => {

    
    };


    script.onerror = () => {

      console.log(
        "Failed to load Razorpay checkout"
      );

    };


    document.body.appendChild(script);


    return () => {

      if (
        document.body.contains(script)
      ) {

        document.body.removeChild(
          script
        );

      }

    };

  }, []);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }


    const dateObject =
      new Date(date);


    if (
      Number.isNaN(
        dateObject.getTime()
      )
    ) {

      return date;

    }


    return dateObject.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment = async () => {

    try {

      setPaymentLoading(true);


      // =================================================
      // CHECK RAZORPAY
      // =================================================

      if (!window.Razorpay) {

        alert(
          "Razorpay checkout is not loaded. Please refresh the page and try again."
        );

        setPaymentLoading(false);

        return;
      }


      // =================================================
      // BOOKING ID
      // =================================================

      const bookingId =
        booking?.id || id;


      if (!bookingId) {

        alert(
          "Booking ID not found."
        );

        setPaymentLoading(false);

        return;
      }



      // =================================================
      // CREATE PAYMENT ORDER
      // =================================================

      const response =
        await createPaymentOrder(
          bookingId
        );


    


      if (
        !response.data?.success ||
        !response.data?.payment
      ) {

        throw new Error(
          response.data?.message ||
          "Failed to create payment order"
        );

      }


      const payment =
        response.data.payment;


      // =================================================
      // RAZORPAY OPTIONS
      // =================================================

      const options = {

        // Razorpay Test Key
        key: payment.key,


        // Amount in paise
        amount: payment.amount,


        currency:
          payment.currency ||
          "INR",


        name:
          "Hotel Booking",


        description:
          `Hotel Booking #${bookingId}`,


        order_id:
          payment.orderId,


        // =================================================
        // PREFILL
        // =================================================

        prefill: {

          name:
            booking?.userName ||
            booking?.name ||
            "",


          email:
            booking?.userEmail ||
            booking?.email ||
            "",


          contact:
            "",
        },


        // =================================================
        // NOTES
        // =================================================

        notes: {

          booking_id:
            String(bookingId),

        },


        // =================================================
        // THEME
        // =================================================

        theme: {

          color:
            "#111827",

        },


        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler:
          async (
            razorpayResponse
          ) => {

           


            try {

              // =========================================
              // VERIFY PAYMENT
              // =========================================

              const verifyResponse =
                await verifyPayment({

                  bookingId,

                  razorpay_payment_id:
                    razorpayResponse
                      .razorpay_payment_id,

                  razorpay_order_id:
                    razorpayResponse
                      .razorpay_order_id,

                  razorpay_signature:
                    razorpayResponse
                      .razorpay_signature,

                });




              // =========================================
              // VERIFICATION SUCCESS
              // =========================================

              if (
                verifyResponse.data?.success
              ) {

                const updatedBooking = {

                  ...booking,

                  id:
                    bookingId,

                  bookingStatus:
                    "confirmed",

                  paymentStatus:
                    "paid",

                };


                // =======================================
                // UPDATE LOCAL STATE
                // =======================================

                setPaymentSuccess(
                  true
                );


                setPaymentId(
                  razorpayResponse
                    .razorpay_payment_id
                );


                // =======================================
                // UPDATE URL STATE
                // =======================================

                navigate(
                  `/booking-success/${bookingId}`,
                  {

                    state: {

                      booking:
                        updatedBooking,

                      hotel,

                      paymentSuccess:
                        true,

                      paymentId:
                        razorpayResponse
                          .razorpay_payment_id,

                    },

                    replace: true,

                  }
                );


              } else {

                alert(
                  verifyResponse.data
                    ?.message ||
                  "Payment verification failed."
                );

              }


            } catch (error) {

              console.log(
                "Payment verification error:",
                error.response?.data ||
                error.message
              );


              alert(
                error.response?.data
                  ?.message ||
                "Payment verification failed."
              );

            } finally {

              setPaymentLoading(
                false
              );

            }

          },


        // =================================================
        // MODAL CLOSE
        // =================================================

        modal: {

          ondismiss: () => {

            console.log(
              "Razorpay checkout closed"
            );


            setPaymentLoading(
              false
            );

          },

        },

      };


      // =================================================
      // CREATE RAZORPAY INSTANCE
      // =================================================

      const razorpay =
        new window.Razorpay(
          options
        );


      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        async (
          paymentResponse
        ) => {

          console.log(
            "RAZORPAY PAYMENT FAILED:",
            // paymentResponse
          );


          try {

            await paymentFailed(
              bookingId
            );


            alert(
              "Payment failed. Please try again."
            );


          } catch (error) {

            console.log(
              "Payment failed API error:",
              error.response?.data ||
              error.message
            );


            alert(
              error.response?.data
                ?.message ||
              "Payment failed."
            );

          } finally {

            setPaymentLoading(
              false
            );

          }

        }
      );


      // =================================================
      // OPEN RAZORPAY
      // =================================================

      razorpay.open();


    } catch (error) {

      console.log(
        "Payment order error:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to start payment."
      );


      setPaymentLoading(false);

    }

  };


  // =====================================================
  // NO BOOKING STATE
  // =====================================================

  if (!booking) {

    return (
      <>
        <Navbar />


        <div className="booking-success-page">

          <div className="success-card">

            <div className="success-icon">
              ✓
            </div>


            <h1>
              Booking Created
            </h1>


            <p>
              Your booking has been
              created successfully.
            </p>


            <p className="success-booking-id">

              Booking ID: #{id}

            </p>


            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
            >
              Go to Home
            </button>

          </div>

        </div>

      </>
    );

  }


  // =====================================================
  // VALUES
  // =====================================================

  const totalPrice =
    Number(
      booking.totalPrice
    ) || 0;


  const rooms =
    Number(
      booking.rooms
    ) || 1;


  const adults =
    Number(
      booking.adults
    ) || 1;


  const children =
    Number(
      booking.children
    ) || 0;


  const nights =
    Number(
      booking.nights
    ) || 0;


  const pricePerNight =
    Number(
      booking.pricePerNight
    ) || 0;


  const bookingId =
    booking.id || id;


  const currentPaymentStatus =
    paymentSuccess
      ? "paid"
      : booking.paymentStatus ||
        "pending";


  const currentBookingStatus =
    paymentSuccess
      ? "confirmed"
      : booking.bookingStatus ||
        "pending";


  // =====================================================
  // JSX
  // =====================================================

  return (
    <>
      <Navbar />


      <main className="booking-success-page">


        {/* =================================================
            SUCCESS HEADER
            ================================================= */}

        <div className="success-card">

          <div
            className={`success-icon ${
              paymentSuccess
                ? "payment-confirmed-icon"
                : ""
            }`}
          >
            ✓
          </div>


          <h1>

            {paymentSuccess
              ? "Booking Confirmed Successfully!"
              : "Booking Created Successfully!"}

          </h1>


          <p className="success-message">

            {paymentSuccess
              ? "Your payment has been verified and your hotel booking is confirmed."
              : "Your hotel booking has been created. Complete payment to confirm your booking."}

          </p>


          <div className="success-booking-id">

            Booking ID:{" "}

            <strong>
              #{bookingId}
            </strong>

          </div>

        </div>


        {/* =================================================
            DETAILS
            ================================================= */}

        <div className="success-details">


          {/* =================================================
              HOTEL
              ================================================= */}

          <div className="success-hotel-card">

            {hotel?.images?.length > 0 ? (

              <img
                src={
                  hotel.images[0].url
                }
                alt={
                  hotel.name
                }
              />

            ) : (

              <div className="success-no-image">
                🏨
              </div>

            )}


            <div className="p-img">

              <h2>

                {hotel?.name ||
                  booking.hotelName ||
                  "Hotel"}

              </h2>


              <p>
                  <span>
                    <img src={LocationImage} alt="" />
                  </span>
                

                {hotel?.location ||
                  booking.hotelLocation ||
                  "Hotel location"}

              </p>

            </div>

          </div>


          {/* =================================================
              STAY DETAILS
              ================================================= */}

          <div className="success-section">

            <h2>
              Stay Details
            </h2>


            <div className="success-grid">


              <div>

                <span>
                  Check-in
                </span>


                <strong>

                  {formatDate(
                    booking.checkIn
                  )}

                </strong>

              </div>


              <div>

                <span>
                  Check-out
                </span>


                <strong>

                  {formatDate(
                    booking.checkOut
                  )}

                </strong>

              </div>


              <div>

                <span>
                  Duration
                </span>


                <strong>

                  {nights} night
                  {nights !== 1
                    ? "s"
                    : ""}

                </strong>

              </div>


              <div>

                <span>
                  Rooms
                </span>


                <strong>

                  {rooms} room
                  {rooms !== 1
                    ? "s"
                    : ""}

                </strong>

              </div>


            </div>

          </div>


          {/* =================================================
              GUESTS
              ================================================= */}

          <div className="success-section">

            <h2>
              Guests
            </h2>


            <div className="success-guests">


              <div>

                <span>
                  <img src={AdultsImage} alt="" />
                </span>


                <strong>

                  {adults} Adult
                  {adults !== 1
                    ? "s"
                    : ""}

                </strong>

              </div>


              <div>

                <span>
                  <img src={ChildImage} alt="" />
                </span>


                <strong>

                  {children} Child
                  {children !== 1
                    ? "ren"
                    : ""}

                </strong>

              </div>


              <div>

                <span>
                  🛏
                </span>


                <strong>

                  {rooms} Room
                  {rooms !== 1
                    ? "s"
                    : ""}

                </strong>

              </div>


            </div>

          </div>


          {/* =================================================
              PAYMENT SUMMARY
              ================================================= */}

          <div className="success-section">

            <h2>
              Payment Summary
            </h2>


            <div className="success-price-row">

              <span>

                ₹
                {pricePerNight.toLocaleString(
                  "en-IN"
                )}

                {" × "}

                {rooms} room
                {rooms !== 1
                  ? "s"
                  : ""}

                {" × "}

                {nights} night
                {nights !== 1
                  ? "s"
                  : ""}

              </span>


              <strong>

                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}

              </strong>

            </div>


            <div className="success-price-divider" />


            <div className="success-total">

              <span>
                Total Booking Amount
              </span>


              <strong>

                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}

              </strong>

            </div>

          </div>


          {/* =================================================
              PAYMENT SUCCESS MESSAGE
              ================================================= */}

          {paymentSuccess && (

            <div className="payment-success-box">

              <div className="payment-success-icon">
                ✓
              </div>


              <div className="payment-success-content">

                <h2>
                  Payment Successful
                </h2>


                <p>
                  Your payment has been
                  verified successfully.
                </p>


                <p>
                  Your booking is now
                  confirmed.
                </p>


                <div className="payment-success-id">

                  Booking ID: #{bookingId}

                </div>


                {paymentId && (

                  <div className="payment-success-id">

                    Payment ID:{" "}

                    {paymentId}

                  </div>

                )}

              </div>

            </div>

          )}


          {/* =================================================
              LEARNING / DEMO NOTICE
              ================================================= */}

          {!paymentSuccess && (

            <div className="payment-demo-notice">

              <strong>
                ⚠️ Learning & Demo Project
              </strong>


              <p>

                This website is developed
                for learning and demonstration
                purposes only. It is not a real
                hotel booking service and does
                not process real-money
                transactions.

              </p>


              <p>

                Razorpay Test Mode is used
                for demonstration. Please use
                the test payment details provided
                by Razorpay.

              </p>

            </div>

          )}


          {/* =================================================
              STATUS
              ================================================= */}

        {/* =================================================
    STATUS
    ================================================= */}

<div className="success-status">

  {/* BOOKING STATUS */}
  <div
    className={
      currentBookingStatus === "confirmed"
        ? "status-item status-confirmed"
        : "status-item status-pending"
    }
  >
    <span>
      Booking Status
    </span>

    <strong>
      {currentBookingStatus}
    </strong>
  </div>


  {/* PAYMENT STATUS */}
  <div
    className={
      currentPaymentStatus === "paid"
        ? "status-item status-paid"
        : "status-item status-payment-pending"
    }
  >
    <span>
      Payment Status
    </span>

    <strong>
      {currentPaymentStatus}
    </strong>
  </div>

</div>


          {/* =================================================
              PAY NOW
              ================================================= */}

          {!paymentSuccess && (

            <button
              type="button"
              className="success-pay-btn"
              onClick={
                handlePayment
              }
              disabled={
                paymentLoading
              }
            >

              {paymentLoading

                ? "Processing Payment..."

                : `Pay ₹${totalPrice.toLocaleString(
                    "en-IN"
                  )}`}

            </button>

          )}


          {/* =================================================
              ACTIONS
              ================================================= */}

          <div className="success-actions">


            <button
              type="button"
              className="success-primary-btn"
              onClick={() =>
                navigate(
                  "/my-bookings"
                )
              }
            >

              View My Bookings

            </button>


            <button
              type="button"
              className="success-secondary-btn"
              onClick={() =>
                navigate("/")
              }
            >

              Back to Home

            </button>


          </div>


        </div>

      </main>

    </>
  );
};


export default BookingSuccess;