import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./components/Home";
import Hotels from "./components/Hotel/Hotel";
import HotelDetails from "./components/Hotel/HotelDetails";

import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminHotels from "./components/Admin/AdminHotels.jsx";
import AdminHotelForm from "./components/Admin/AdminHotelForm.jsx";
import AdminBookings from "./components/Admin/AdminBookings.jsx";
import AdminUsers from "./components/Admin/AdminUsers.jsx";
import AdminHotelAvailability from "./components/Admin/AdminHotelAvailability.jsx";

import Register from "./components/Auth/Register";
import VerifyOTP from "./components/Auth/VerifyOTP";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import VerifyResetOTP from "./components/Auth/VerifyResetOTP";
import ResetPassword from "./components/Auth/ResetPassword";

import ProtectedRoute from "./components/Routes/ProtectedRoute.jsx";
import AdminRoute from "./components/Routes/AdminRoute.jsx";

import Booking from "./components/Booking/Booking.jsx";
import BookingSuccess from "./components/Booking/BookingSuccess.jsx";
import MyBookings from "./components/Booking/MyBookings.jsx";
import BookingDetails from "./components/Booking/BookingDetails.jsx";
import MyProfile from "./components/Profile/MyProfile.jsx";

import About from "./components/Hotel/About.jsx";
import Contact from "./components/Hotel/Contact.jsx";
import Footer from "./components/Hotel/Footer.jsx";
import AuthError from "./components/Auth/AuthError.jsx";


const App = () => {

  const location = useLocation();

  // ================= FOOTER HIDE =================

  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verify-otp" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/forgot-password/verify-otp" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/auth-error";


  return (
    <>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/hotels"
          element={<Hotels />}
        />

        <Route
          path="/hotelsDitails/:id"
          element={<HotelDetails />}
        />

        <Route
          path="/aboutus"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
        <Route path="/auth-error" element={<AuthError/>}/>


        {/* ================= AUTH ================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/forgot-password/verify-otp"
          element={<VerifyResetOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* ================= USER PROTECTED ================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/booking-success/:id"
            element={<BookingSuccess />}
          />

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          <Route
            path="/booking/:id"
            element={<BookingDetails />}
          />

          <Route
            path="/my-profile"
            element={<MyProfile />}
          />

        </Route>


        {/* ================= ADMIN ================= */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/hotels"
            element={<AdminHotels />}
          />

          <Route
            path="/admin/hotels/add"
            element={<AdminHotelForm />}
          />

          <Route
            path="/admin/hotels/edit/:id"
            element={<AdminHotelForm />}
          />

          <Route
            path="/admin/bookings"
            element={<AdminBookings />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/hotel-availability"
            element={<AdminHotelAvailability />}
          />

        </Route>

      </Routes>


      {/* ================= FOOTER ================= */}

      {!hideFooter && <Footer />}

    </>
  );
};

export default App;