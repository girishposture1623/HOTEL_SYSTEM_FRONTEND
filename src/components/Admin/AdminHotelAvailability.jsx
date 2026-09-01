import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  hotelAvailability,
} from "../../apis/adminApi.js";

import HotelImg from '../../assets/ManageHotel.png'

import "../../Styles/AdminHotelAvailability.css";


const AdminHotelAvailability = () => {

  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  const fetchAvailability = async () => {

    try {

      setLoading(true);

      setError("");


      const response =
        await hotelAvailability();



      if (!response.data?.success) {

        setError(
          response.data?.message ||
          "Failed to load hotel availability"
        );

        return;
      }


      setHotels(
        Array.isArray(
          response.data.hotels
        )
          ? response.data.hotels
          : []
      );


    } catch (error) {

      console.log(
        "Hotel availability error:",
        error.response?.data ||
        error.message
      );


      setError(
        error.response?.data?.message ||
        "Failed to load hotel availability"
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchAvailability();

  }, []);


  // =====================================================
  // NUMBER FORMAT
  // =====================================================

  const formatNumber = (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    );

  };


  // =====================================================
  // TOTALS
  // =====================================================

  const totalRooms =
    hotels.reduce(
      (total, hotel) =>
        total +
        Number(
          hotel.totalRooms || 0
        ),
      0
    );


  const bookedRooms =
    hotels.reduce(
      (total, hotel) =>
        total +
        Number(
          hotel.bookedRooms || 0
        ),
      0
    );


  const availableRooms =
    hotels.reduce(
      (total, hotel) =>
        total +
        Number(
          hotel.availableRooms || 0
        ),
      0
    );


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="availability-loading">

        <div className="availability-spinner"></div>

        <p>
          Loading hotel availability...
        </p>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-availability-page">


      {/* =================================================
          HEADER
          ================================================= */}

      <header className="availability-header">


        <div>

          <button
            className="availability-back"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            ← Dashboard
          </button>


          <h1>
            Hotel Availability
          </h1>


          <p>
            Check room availability for all hotels
          </p>

        </div>


        <button
          className="refresh-availability"
          onClick={
            fetchAvailability
          }
        >

          ↻ Refresh

        </button>


      </header>


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (

        <div className="availability-error">

          <span>
            ⚠️ {error}
          </span>


          <button
            onClick={
              fetchAvailability
            }
          >
            Try Again
          </button>

        </div>

      )}


      {/* =================================================
          SUMMARY
          ================================================= */}

      <div className="availability-summary">


        <div className="availability-summary-card">

          <div className="summary-icon">
            <img src={HotelImg} alt="" />
          </div>

          <div>

            <span>
              Total Hotels
            </span>

            <strong>
              {formatNumber(
                hotels.length
              )}
            </strong>

          </div>

        </div>


        <div className="availability-summary-card">

          <div className="summary-icon">
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


        <div className="availability-summary-card">

          <div className="summary-icon available">
            ✓
          </div>

          <div>

            <span>
              Available Rooms
            </span>

            <strong className="available-number">
              {formatNumber(
                availableRooms
              )}
            </strong>

          </div>

        </div>


        <div className="availability-summary-card">

          <div className="summary-icon booked">
            ●
          </div>

          <div>

            <span>
              Booked Rooms
            </span>

            <strong className="booked-number">
              {formatNumber(
                bookedRooms
              )}
            </strong>

          </div>

        </div>


      </div>


      {/* =================================================
          HOTEL TABLE
          ================================================= */}

      <div className="availability-card">


        <div className="availability-card-header">

          <div>

            <h2>
              Room Availability
            </h2>

            <p>
              Current room status by hotel
            </p>

          </div>

        </div>


        {hotels.length > 0 ? (

          <div className="availability-table-wrapper">

            <table className="availability-table">

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    Hotel
                  </th>

                  <th>
                    Total Rooms
                  </th>

                  <th>
                    Booked Rooms
                  </th>

                  <th>
                    Available Rooms
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {hotels.map(
                  (hotel, index) => {


                    const total =
                      Number(
                        hotel.totalRooms || 0
                      );


                    const booked =
                      Number(
                        hotel.bookedRooms || 0
                      );


                    const available =
                      Number(
                        hotel.availableRooms || 0
                      );


                    const percentage =
                      total > 0
                        ? Math.round(
                            (available /
                              total) *
                              100
                          )
                        : 0;


                    let status =
                      "Available";


                    let statusClass =
                      "good";


                    if (
                      available === 0
                    ) {

                      status =
                        "Full";

                      statusClass =
                        "full";

                    } else if (
                      percentage <= 30
                    ) {

                      status =
                        "Low";

                      statusClass =
                        "low";

                    }


                    return (

                      <tr
                        key={
                          hotel.id
                        }
                      >


                        {/* NUMBER */}

                        <td>

                          {index + 1}

                        </td>


                        {/* HOTEL */}

                        <td>

                          <div className="hotel-name-cell">

                            <div className="hotel-small-icon">
                              <img src={HotelImg} alt="" />
                            </div>

                            <strong>
                              {hotel.name ||
                                "Unnamed Hotel"}
                            </strong>

                          </div>

                        </td>


                        {/* TOTAL */}

                        <td>

                          <strong>
                            {formatNumber(
                              total
                            )}
                          </strong>

                        </td>


                        {/* BOOKED */}

                        <td>

                          <span className="booked-room-number">

                            {formatNumber(
                              booked
                            )}

                          </span>

                        </td>


                        {/* AVAILABLE */}

                        <td>

                          <span className="available-room-number">

                            {formatNumber(
                              available
                            )}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`availability-status ${statusClass}`}
                          >

                            {status}

                          </span>

                        </td>


                      </tr>

                    );

                  }
                )}

              </tbody>


              {/* TOTAL */}

              <tfoot>

                <tr>

                  <td></td>

                  <td>
                    <strong>
                      Total
                    </strong>
                  </td>

                  <td>
                    <strong>
                      {formatNumber(
                        totalRooms
                      )}
                    </strong>
                  </td>

                  <td>
                    <strong className="booked-room-number">
                      {formatNumber(
                        bookedRooms
                      )}
                    </strong>
                  </td>

                  <td>
                    <strong className="available-room-number">
                      {formatNumber(
                        availableRooms
                      )}
                    </strong>
                  </td>

                  <td>
                    -
                  </td>

                </tr>

              </tfoot>

            </table>

          </div>

        ) : (

          <div className="no-availability">

            <div>
              🛏
            </div>

            <h3>
              No Hotels Found
            </h3>

            <p>
              There is no hotel availability data.
            </p>

          </div>

        )}

      </div>


    </div>

  );

};


export default AdminHotelAvailability;