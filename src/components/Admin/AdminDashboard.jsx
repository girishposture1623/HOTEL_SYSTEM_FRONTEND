import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from '../../components/Loader.jsx'
import "../../Styles/AdminDashboard.css";
import HotelsImg from '../../assets/ManageHotel.png'
import BookingHotel from '../../assets/Total.png'
import UserImg from '../../assets/UserImg.png'
import TotalRevenue from '../../assets/Total_Revenue.png'
import AdminDashboardImg from '../../assets/AdminDashImg.png'
import WebsiteImg from '../../assets/Website.png'
import LogOutImg from '../../assets/LogOut.png'

import {
  dashBoard,
  hotelAvailability,
  bookingOverview,
  revenueOverview,
} from "../../apis/adminApi.js";

import api from "../../apis/api.js";


const AdminDashboard = () => {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  });

  const [availability, setAvailability] =
    useState([]);

  const [bookingOverviewData, setBookingOverviewData] =
    useState([]);

  const [revenueOverviewData, setRevenueOverviewData] =
    useState([]);

  const [recentBookings, setRecentBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  
  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");


        const [
          dashboardResponse,
          availabilityResponse,
          bookingResponse,
          revenueResponse,
        ] = await Promise.all([

          dashBoard(),

          hotelAvailability(),

          bookingOverview(),

          revenueOverview(),

        ]);


        if (
          dashboardResponse.data?.success
        ) {

          setStats(
            dashboardResponse.data.stats || {}
          );

        }


        if (
          availabilityResponse.data?.success
        ) {

          setAvailability(
            Array.isArray(
              availabilityResponse.data.hotels
            )
              ? availabilityResponse.data.hotels
              : []
          );

        }


        if (
          bookingResponse.data?.success
        ) {

          setBookingOverviewData(
            Array.isArray(
              bookingResponse.data.overview
            )
              ? bookingResponse.data.overview
              : []
          );

        }


        if (
          revenueResponse.data?.success
        ) {

          setRevenueOverviewData(
            Array.isArray(
              revenueResponse.data.revenue
            )
              ? revenueResponse.data.revenue
              : []
          );

        }

        try {

          const response =
            await api.get(
              "/admin/recent-bookings"
            );



          if (
            response.data?.success
          ) {

            setRecentBookings(
              Array.isArray(
                response.data.bookings
              )
                ? response.data.bookings
                : []
            );

          }

        } catch (recentError) {

          console.log(
            "Recent bookings error:",
            recentError.response?.data ||
            recentError.message
          );

        }

      } catch (error) {

        console.log(
          "Admin dashboard error:",
          error.response?.data ||
          error.message
        );


        setError(
          error.response?.data?.message ||
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);

  const handleLogout = async () => {

    try {

      await api.post(
        "/auth/logout"
      );

    } catch (error) {

      console.log(
        "Logout error:",
        error.response?.data ||
        error.message
      );

    } finally {

      navigate("/login");

    }

  };


  if (loading) {

    return <Loader/>

  }

  const totalRooms =
    availability.reduce(
      (total, hotel) =>
        total +
        Number(
          hotel.totalRooms || 0
        ),
      0
    );


  const availableRooms =
    availability.reduce(
      (total, hotel) =>
        total +
        Number(
          hotel.availableRooms || 0
        ),
      0
    );


  const bookedRooms =
    availability.reduce(
      (total, hotel) =>
        total +
        Number(
          hotel.bookedRooms || 0
        ),
      0
    );



  const formatNumber = (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    );

  };


  const formatCurrency = (value) => {

    return `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    )}`;

  };



  return (

    <div className="admin-dashboard">


      <aside className="admin-sidebar">


        <div className="admin-logo">

          <div className="admin-logo-box">
            S
          </div>

          <div>

            <h2>
              Stayora
            </h2>

            <span>
              ADMIN PANEL
            </span>

          </div>

        </div>


        <nav className="admin-nav">


          <button
            className="admin-nav-item active"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >

            <span>
              <img src={AdminDashboardImg} alt="" />
            </span>

            Dashboard

          </button>


          <div className="admin-nav-heading">
            MANAGEMENT
          </div>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate(
                "/admin/hotels"
              )
            }
          >

            <span>
              <img src={HotelsImg} alt="" />
            </span>

            Hotels

          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate(
                "/admin/hotel-availability"
              )
            }
          >

            <span>
              🛏
            </span>

            Hotel Availability

          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate(
                "/admin/bookings"
              )
            }
          >

            <span>
              <img src={BookingHotel} alt="" />
            </span>

            Bookings

          </button>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate(
                "/admin/users"
              )
            }
          >

            <span>
              <img src={UserImg} alt="" />
            </span>

            Users

          </button>


          <div className="admin-nav-heading">
            OTHER
          </div>


          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/")
            }
          >

            <span>
              <img src={WebsiteImg} alt="" />
            </span>

            View Website

          </button>


        </nav>


        <button
          className="admin-logout"
          onClick={
            handleLogout
          }
        >

          <span>
            <img src={LogOutImg} alt="" />
          </span>

          Logout

        </button>


      </aside>


     
      <main className="admin-main">


        <header className="admin-topbar">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, Admin
            </p>

          </div>


          <div className="admin-profile">

           

          </div>

        </header>


        
        <section className="admin-content">


          {error && (

            <div className="dashboard-warning">

              ⚠️ {error}

            </div>

          )}


          
          <div className="admin-stats">


            <div className="stat-card">

              <div className="stat-icon blue">
                <img src={HotelsImg} alt="" />
              </div>

              <div>

                <span>
                  Total Hotels
                </span>

                <strong>
                  {formatNumber(
                    stats.totalHotels
                  )}
                </strong>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon green">
                🛏
              </div>

              <div>

                <span>
                  Total Rooms
                </span>

                <strong>
                  {formatNumber(
                    totalRooms
                  )}
                </strong>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon orange">
                <img src={BookingHotel} alt="" />
              </div>

              <div>

                <span>
                  Total Bookings
                </span>

                <strong>
                  {formatNumber(
                    stats.totalBookings
                  )}
                </strong>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon purple">
                <img src={UserImg} alt="" />
              </div>

              <div>

                <span>
                  Total Users
                </span>

                <strong>
                  {formatNumber(
                    stats.totalUsers
                  )}
                </strong>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon red">
                <img src={TotalRevenue} alt="" />
              </div>

              <div>

                <span>
                  Total Revenue
                </span>

                <strong>
                  {formatCurrency(
                    stats.totalRevenue
                  )}
                </strong>

              </div>

            </div>


          </div>


          {/* =================================================
              OVERVIEW
              ================================================= */}

          <div className="overview-grid">


            {/* =================================================
                BOOKING OVERVIEW
                ================================================= */}

            <div className="admin-card">

              <div className="card-title">

                <div>

                  <h2>
                    Booking Overview
                  </h2>

                  <p>
                    Last 6 months
                  </p>

                </div>

              </div>


              <div className="overview-list">

                {bookingOverviewData.length > 0 ? (

                  bookingOverviewData.map(
                    (item, index) => (

                      <div
                        className="overview-row"
                        key={index}
                      >

                        <span>

                          <i className="status-dot confirmed"></i>

                          {item.month}

                        </span>


                        <strong>

                          {formatNumber(
                            item.bookings
                          )}

                        </strong>

                      </div>

                    )
                  )

                ) : (

                  <p className="empty-overview">
                    No booking data available
                  </p>

                )}

              </div>

            </div>


            {/* =================================================
                HOTEL AVAILABILITY
                ================================================= */}

            <div className="admin-card">

              <div className="card-title">

                <div>

                  <h2>
                    Hotel Availability
                  </h2>

                  <p>
                    Room availability
                  </p>

                </div>

              </div>


              <div className="availability-box">


                <div className="availability-item">

                  <span>
                    Total Rooms
                  </span>

                  <strong>
                    {formatNumber(
                      totalRooms
                    )}
                  </strong>

                </div>


                <div className="availability-item">

                  <span>
                    Available Rooms
                  </span>

                  <strong className="available-text">
                    {formatNumber(
                      availableRooms
                    )}
                  </strong>

                </div>


                <div className="availability-item">

                  <span>
                    Booked Rooms
                  </span>

                  <strong className="booked-text">
                    {formatNumber(
                      bookedRooms
                    )}
                  </strong>

                </div>


              </div>


              {/* HOTEL LIST */}

              <div className="availability-hotels">

                {availability.length > 0 ? (

                  availability
                    .slice(0, 5)
                    .map(
                      (hotel) => (

                        <div
                          className="availability-hotel-row"
                          key={hotel.id}
                        >

                          <span>
                            {hotel.name}
                          </span>

                          <strong>

                            {hotel.availableRooms}

                            <small>
                              / {hotel.totalRooms}
                            </small>

                          </strong>

                        </div>

                      )
                    )

                ) : (

                  <p className="empty-overview">
                    No hotel data available
                  </p>

                )}

              </div>

            </div>


            {/* =================================================
                REVENUE OVERVIEW
                ================================================= */}

            <div className="admin-card">

              <div className="card-title">

                <div>

                  <h2>
                    Revenue Overview
                  </h2>

                  <p>
                    Last 6 months
                  </p>

                </div>

              </div>


              <div className="revenue-box">

                <span>
                  Total Revenue
                </span>

                <strong>
                  {formatCurrency(
                    stats.totalRevenue
                  )}
                </strong>

              </div>


              <div className="monthly-revenue">

                {revenueOverviewData.length > 0 ? (

                  revenueOverviewData.map(
                    (item, index) => (

                      <div
                        className="revenue-row"
                        key={index}
                      >

                        <span>
                          {item.month}
                        </span>

                        <strong>
                          {formatCurrency(
                            item.revenue
                          )}
                        </strong>

                      </div>

                    )
                  )

                ) : (

                  <p className="empty-overview">
                    No revenue data available
                  </p>

                )}

              </div>

            </div>


          </div>


          {/* =================================================
              BOOKING STATUS
              ================================================= */}

          <div className="admin-card">

            <div className="card-title">

              <div>

                <h2>
                  Booking Status
                </h2>

                <p>
                  Current booking summary
                </p>

              </div>

            </div>


            <div className="booking-status-grid">


              <div className="booking-status-card confirmed-card">

                <span>
                  Confirmed
                </span>

                <strong>
                  {formatNumber(
                    stats.confirmedBookings
                  )}
                </strong>

              </div>


              <div className="booking-status-card pending-card">

                <span>
                  Pending
                </span>

                <strong>
                  {formatNumber(
                    stats.pendingBookings
                  )}
                </strong>

              </div>


              <div className="booking-status-card cancelled-card">

                <span>
                  Cancelled
                </span>

                <strong>
                  {formatNumber(
                    stats.cancelledBookings
                  )}
                </strong>

              </div>


            </div>

          </div>


          {/* =================================================
              RECENT BOOKINGS
              ================================================= */}

          <div className="admin-card">


            <div className="card-title">

              <div>

                <h2>
                  Recent Bookings
                </h2>

                <p>
                  Latest hotel bookings
                </p>

              </div>


              <button
                className="view-all"
                onClick={() =>
                  navigate(
                    "/admin/bookings"
                  )
                }
              >
                View All
              </button>

            </div>


            <div className="table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Guest
                    </th>

                    <th>
                      Hotel
                    </th>

                    <th>
                      Check-in
                    </th>

                    <th>
                      Check-out
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Booking
                    </th>

                    <th>
                      Payment
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentBookings.length > 0 ? (

                    recentBookings
                      .slice(0, 5)
                      .map(
                        (booking) => (

                          <tr
                            key={
                              booking.id
                            }
                          >

                            <td>
                              #{booking.id}
                            </td>


                            <td>

                              {booking.user_name ||
                                "-"}

                            </td>


                            <td>

                              {booking.hotel_name ||
                                "-"}

                            </td>


                            <td>

                              {booking.check_in ||
                                "-"}

                            </td>


                            <td>

                              {booking.check_out ||
                                "-"}

                            </td>


                            <td>

                              {formatCurrency(
                                booking.total_price
                              )}

                            </td>


                            <td>

                              <span
                                className={`status-badge ${
                                  booking.booking_status
                                }`}
                              >

                                {
                                  booking.booking_status
                                }

                              </span>

                            </td>


                            <td>

                              <span
                                className={`payment-badge ${
                                  booking.payment_status
                                }`}
                              >

                                {
                                  booking.payment_status
                                }

                              </span>

                            </td>

                          </tr>

                        )
                      )

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        className="empty-cell"
                      >

                        No recent bookings found

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* =================================================
              HOTEL AVAILABILITY LIST
              ================================================= */}

          <div className="admin-card">


            <div className="card-title">

              <div>

                <h2>
                  Hotels
                </h2>

                <p>
                  Room availability by hotel
                </p>

              </div>


              <button
                className="view-all"
                onClick={() =>
                  navigate(
                    "/admin/hotels"
                  )
                }
              >
                Manage Hotels
              </button>

            </div>


            <div className="hotel-availability-list">

              {availability.length > 0 ? (

                availability.map(
                  (hotel) => (

                    <div
                      className="hotel-availability-item"
                      key={hotel.id}
                    >

                      <div>

                        <strong>
                          {hotel.name}
                        </strong>

                        <span>
                          Total rooms:{" "}
                          {hotel.totalRooms}
                        </span>

                      </div>


                      <div className="hotel-room-numbers">

                        <span className="room-available">

                          Available:{" "}

                          {hotel.availableRooms}

                        </span>


                        <span className="room-booked">

                          Booked:{" "}

                          {hotel.bookedRooms}

                        </span>

                      </div>

                    </div>

                  )
                )

              ) : (

                <div className="empty-hotels">

                  No hotel availability found

                </div>

              )}

            </div>


          </div>


        </section>

      </main>

    </div>

  );

};


export default AdminDashboard;