import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

import "../Styles/Navbar.css";
import MyProfileImg from "../assets/My_Profile.png";
import MyBookingImg from "../assets/My_Booking.png";
import LogOutImg from "../assets/LogOut.png";
import AdminImg from "../assets/Admin.png";
import ManageHotelImg from "../assets/ManageHotel.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, logout } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    setShowMenu(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-btn")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setShowMenu(false);
    setIsMobileMenuOpen(false);

    await logout();

    navigate("/login");
  };

  const isLoggedIn = Boolean(user);

  const userName = user?.name || user?.fullName || "User";

  const userEmail = user?.email || "";

  const userRole = String(user?.role || user?.userRole || "").toLowerCase();

  const isAdmin = userRole === "admin";

  const userInitial = userName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Hotel <br />
            <span className="span">Booking</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo login-brand">
          <div className="brand-logo">S</div>

          <div className="brand-text">
            <h2>Stayora</h2>

            <span>HOTELS & RESORTS</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/hotels"
            className={`nav-link ${
              location.pathname === "/hotels" ? "active" : ""
            }`}
          >
            Hotels
          </Link>

          <Link
            to="/aboutus"
            className={`nav-link ${
              location.pathname === "/aboutus" ? "active" : ""
            }`}
          >
            AboutUs
          </Link>

          <Link
            to="/contact"
            className={`nav-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
          >
            Contact
          </Link>

          {/* {isLoggedIn && !isAdmin && (
            <Link
              to="/my-bookings"
              className={`nav-link ${
                location.pathname === "/my-bookings" ? "active" : ""
              }`}
            >
              My Bookings
            </Link>
          )} */}
        </nav>

        <div className="navbar-actions">
          {!isLoggedIn && (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>

              <Link to="/register" className="nav-book-btn" id="nav-book-btn">
                Start Booking
              </Link>
            </>
          )}

          {isLoggedIn && (
            <div className="profile-menu-container" ref={menuRef}>
              <button
                type="button"
                className="profile-menu-btn"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <span className="profile-user-icon">
                  {isAdmin ? "A" : userInitial}
                </span>

                <span className="profile-user-name">{userName}</span>

                <span className={`profile-arrow ${showMenu ? "open" : ""}`}>
                  ▾
                </span>
              </button>

              {showMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-user">
                    <div className="profile-dropdown-avatar">
                      {isAdmin ? "A" : userInitial}
                    </div>

                    <div className="profile-dropdown-info">
                      <strong>{userName}</strong>

                      <span>{userEmail}</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  {!isAdmin && (
                    <>
                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={() => {
                          setShowMenu(false);

                          navigate("/my-profile");
                        }}
                      >
                        <span>
                          <img src={MyProfileImg} alt="" />
                        </span>

                        <span>My Profile</span>
                      </button>

                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={() => {
                          setShowMenu(false);

                          navigate("/my-bookings");
                        }}
                      >
                        <span>
                          <img src={MyBookingImg} alt="" />
                        </span>

                        <span>My Bookings</span>
                      </button>
                    </>
                  )}

                  {/* =================================================
                      ADMIN OPTIONS
                      ================================================= */}

                  {isAdmin && (
                    <>
                      {/* ADMIN DASHBOARD */}

                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={() => {
                          setShowMenu(false);

                          navigate("/admin/dashboard");
                        }}
                      >
                        <span>
                          <img src={AdminImg} alt="" />
                        </span>

                        <span>Admin Dashboard</span>
                      </button>

                      {/* MANAGE HOTELS */}

                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={() => {
                          setShowMenu(false);

                          navigate("/admin/hotels");
                        }}
                      >
                        <span>
                          <img src={ManageHotelImg} alt="" />
                        </span>

                        <span>Manage Hotels</span>
                      </button>
                    </>
                  )}

                
                  <button
                    type="button"
                    className="profile-dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <span>
                      <img src={LogOutImg} alt="" />
                    </span>

                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

       
        <button
          type="button"
          className={`hamburger-btn ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

     
      <div
        ref={mobileMenuRef}
        className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
      >
        <div className="mobile-menu-content">
          
          <Link
            to="/"
            className={`mobile-nav-link ${
              location.pathname === "/" ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
          Home
          </Link>

          <Link
            to="/hotels"
            className={`mobile-nav-link ${
              location.pathname === "/hotels" ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
             Hotels
          </Link>

          <Link
            to="/aboutus"
            className={`mobile-nav-link ${
              location.pathname === "/aboutus" ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
             AboutUs
          </Link>

          <Link
            to="/contact"
            className={`mobile-nav-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>

   
          {/* {isLoggedIn && !isAdmin && (
            <Link
              to="/my-bookings"
              className={`mobile-nav-link ${
                location.pathname === "/my-bookings" ? "active" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
               My Bookings
            </Link>
          )} */}

          <div className="mobile-menu-divider" />

        
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="mobile-login-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="mobile-book-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start Booking
              </Link>
            </>
          )}

         
          {isLoggedIn && (
            <>
            
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {isAdmin ? "A" : userInitial}
                </div>

                <div className="mobile-user-details">
                  <strong>{userName}</strong>

                  <span>{userEmail}</span>
                </div>
              </div>

              <div className="mobile-menu-divider" />

              {!isAdmin && (
                <>
                  <button
                    type="button"
                    className="mobile-nav-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);

                      navigate("/my-profile");
                    }}
                  >
                   

                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    className="mobile-nav-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);

                      navigate("/my-bookings");
                    }}
                  >
                   

                    <span>My Bookings</span>
                  </button>
                </>
              )}

           
              {isAdmin && (
                <>
                  <button
                    type="button"
                    className="mobile-nav-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);

                      navigate("/admin/dashboard");
                    }}
                  >
                    

                    <span>Admin Dashboard</span>
                  </button>

                  <button
                    type="button"
                    className="mobile-nav-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);

                      navigate("/admin/hotels");
                    }}
                  >
                    

                    <span>Manage Hotels</span>
                  </button>
                </>
              )}

              <div className="mobile-menu-divider" />

            
              <button
                type="button"
                className="mobile-nav-btn mobile-logout-btn"
                onClick={handleLogout}
              >
               

                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
