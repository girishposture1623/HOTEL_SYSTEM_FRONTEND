import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Navbar.jsx";


import Loader from '../../components/Loader.jsx'
import AdultsImage from "../../assets/user.png";
import ChildImage from "../../assets/icons8-children-50.png";

import SearchImage from "../../assets/search-interface-symbol.png";


import "../../Styles/AdminBookings.css";
import { changeBookingStatus, getBooking } from "../../apis/adminApi.js";

const AdminBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");


 
  const fetchBookings = async () => {
    try {

      setLoading(true);
      setError("");

      const response =
        await getBooking();


      setBookings(
        response.data?.bookings || []
      );

    } catch (error) {

      console.log(
        "Get admin bookings error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load bookings."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchBookings();
  }, []);



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


 
  const formatPrice = (price) => {

    return (
      Number(price) || 0
    ).toLocaleString("en-IN");

  };



  const getStatusClass = (
    status
  ) => {

    const value =
      String(
        status || ""
      ).toLowerCase();

    if (
      value === "confirmed"
    ) {
      return "admin-status-confirmed";
    }

    if (
      value === "cancelled"
    ) {
      return "admin-status-cancelled";
    }

    if (
      value === "expired"
    ) {
      return "admin-status-expired";
    }

    return "admin-status-pending";
  };


  const handleStatusChange =
    async (
      bookingId,
      newStatus
    ) => {

      try {

        setUpdatingId(
          bookingId
        );

        setError("");

        const response =
          await changeBookingStatus(
            bookingId,
            newStatus
          );


        if (
          response.data?.success
        ) {

          setBookings(
            (previous) =>
              previous.map(
                (booking) =>
                  booking.id ===
                  bookingId
                    ? {
                        ...booking,
                        booking_status:
                          newStatus,
                      }
                    : booking
              )
          );

        }

      } catch (error) {

        console.log(
          "Change booking status error:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data?.message ||
            "Failed to update booking status."
        );

      } finally {

        setUpdatingId(
          null
        );

      }
    };


 
  const filteredBookings =
    bookings.filter(
      (booking) => {

        const searchValue =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          !searchValue ||
          String(
            booking.id || ""
          )
            .toLowerCase()
            .includes(searchValue) ||

          String(
            booking.user_name || ""
          )
            .toLowerCase()
            .includes(searchValue) ||

          String(
            booking.user_email || ""
          )
            .toLowerCase()
            .includes(searchValue) ||

          String(
            booking.hotel_name || ""
          )
            .toLowerCase()
            .includes(searchValue);


        const bookingStatus =
          String(
            booking.booking_status ||
              "pending"
          ).toLowerCase();

        const matchesStatus =
          statusFilter === "all" ||
          bookingStatus ===
            statusFilter;


        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );


  
  const totalBookings =
    bookings.length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.booking_status ===
        "pending"
    ).length;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.booking_status ===
        "confirmed"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.booking_status ===
        "cancelled"
    ).length;


  
  if (loading) {

    return <Loader/>

  }


  // =====================================================
  // JSX
  // =====================================================

  return (
    <>
      <Navbar />

      <main className="admin-bookings-page">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="admin-bookings-header">

          <div>

            <h1>
              Booking Management
            </h1>

            <p>
              Manage all customer hotel bookings.
            </p>

          </div>

          <button
            type="button"
            className="admin-refresh-btn"
            onClick={
              fetchBookings
            }
          >
            ↻ Refresh
          </button>

        </div>


        {/* =================================================
            ERROR
            ================================================= */}

        {error && (

          <div className="admin-bookings-error">
            {error}
          </div>

        )}


        {/* =================================================
            STATS
            ================================================= */}

        <div className="admin-booking-stats">

          <div className="admin-booking-stat">

            <span>
              Total Bookings
            </span>

            <strong>
              {totalBookings}
            </strong>

          </div>


          <div className="admin-booking-stat">

            <span>
              Pending
            </span>

            <strong>
              {pendingBookings}
            </strong>

          </div>


          <div className="admin-booking-stat">

            <span>
              Confirmed
            </span>

            <strong>
              {confirmedBookings}
            </strong>

          </div>


          <div className="admin-booking-stat">

            <span>
              Cancelled
            </span>

            <strong>
              {cancelledBookings}
            </strong>

          </div>

        </div>


        {/* =================================================
            FILTER BAR
            ================================================= */}

        <div className="admin-booking-filters">

          <div className="admin-booking-search">

            <span>
             <img src={SearchImage} alt="" />
            </span>

            <input
              type="text"
              placeholder="Search booking, user or hotel..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <select
            className="admin-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="cancelled">
              Cancelled
            </option>

            <option value="expired">
              Expired
            </option>

          </select>

        </div>


        
        <div className="admin-booking-result-count">

          Showing{" "}
          <strong>
            {filteredBookings.length}
          </strong>{" "}
          of{" "}
          <strong>
            {totalBookings}
          </strong>{" "}
          bookings

        </div>


        
        {filteredBookings.length === 0 ? (

          <div className="admin-no-bookings">

            <div>
              📋
            </div>

            <h2>
              No bookings found
            </h2>

            <p>
              Try changing your search or filter.
            </p>

          </div>

        ) : (

         
          <div className="admin-bookings-table-wrapper">

            <table className="admin-bookings-table">

              <thead>

                <tr>

                  <th>
                    Booking
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Hotel
                  </th>

                  <th>
                    Stay
                  </th>

                  <th>
                    Guests
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredBookings.map(
                  (booking) => (

                    <tr
                      key={booking.id}
                    >


                      <td>

                        <div className="admin-booking-id">

                          <strong>
                            #{booking.id}
                          </strong>

                          <span>
                            {formatDate(
                              booking.created_at
                            )}
                          </span>

                        </div>

                      </td>



                      <td>

                        <div className="admin-customer">

                          <strong>
                            {booking.user_name ||
                              "Unknown User"}
                          </strong>

                          <span>
                            {booking.user_email ||
                              "-"}
                          </span>

                        </div>

                      </td>



                      <td>

                        <div className="admin-hotel">

                          <strong>
                            {booking.hotel_name ||
                              "Hotel"}
                          </strong>

                          <span>
                            {booking.hotel_location ||
                              "-"}
                          </span>

                        </div>

                      </td>


                      {/* STAY */}

                      <td>

                        <div className="admin-stay">

                          <strong>
                            {formatDate(
                              booking.check_in
                            )}
                          </strong>

                          <span>
                            to{" "}
                            {formatDate(
                              booking.check_out
                            )}
                          </span>

                        </div>

                      </td>


                      {/* GUESTS */}

                      <td>

                        <div className="admin-guests">

                          <span>
                            <img src={AdultsImage} alt="" />{" "}
                            {booking.adults || 0}
                          </span>

                          <span>
                            <img src={ChildImage} alt="" />{" "}
                            {booking.children || 0}
                          </span>

                          <span>
                            🛏{" "}
                            {booking.rooms_booked || 0}
                          </span>

                        </div>

                      </td>


                      {/* AMOUNT */}

                      <td>

                        <strong className="admin-amount">

                          ₹
                          {formatPrice(
                            booking.total_price
                          )}

                        </strong>

                      </td>


                      {/* PAYMENT */}

                      <td>

                        <span
                          className={`admin-payment-status ${
                            booking.payment_status ===
                            "paid"
                              ? "admin-payment-paid"
                              : "admin-payment-pending"
                          }`}
                        >
                          {
                            booking.payment_status ||
                              "pending"
                          }
                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-status-badge ${getStatusClass(
                            booking.booking_status
                          )}`}
                        >
                          {booking.booking_status ||
                            "pending"}
                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        <select
                          className="admin-status-select"
                          value={
                            booking.booking_status ||
                            "pending"
                          }
                          disabled={
                            updatingId ===
                            booking.id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              booking.id,
                              e.target.value
                            )
                          }
                        >

                          <option value="pending">
                            Pending
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>

                          <option value="expired">
                            Expired
                          </option>

                        </select>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </main>
    </>
  );
};

export default AdminBookings;