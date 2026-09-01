import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../apis/api.js";
import "../../Styles/Login.css";
import { useAuth } from "../../Context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();

  const { getCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      

      if (response.data.success) {

       
        await getCurrentUser();

        
        navigate("/");
      }

    } catch (error) {
      console.log(
        "Login error:",
        error.response?.data || error.message
      );

      const backendError = error.response?.data;

      if (backendError?.errors?.length > 0) {
        setError(
          backendError.errors
            .map((item) => item.message)
            .join(", ")
        );
      } else {
        setError(
          backendError?.message ||
            "Invalid email or password."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_LOGIN;
  };

  return (
    <div className="login-page">

      <div className="login-left">

        <div className="login-brand" onClick={()=> navigate("/")} role="button">
          

          <div className="brand-logo">
            S
          </div>

          <div>
            <h2>Stayora</h2>

            <span>
              HOTELS & RESORTS
            </span>
          </div>

        </div>

        <div className="login-left-content">

          <h1>
            Welcome back.
            <br />
            Your stay awaits.
          </h1>

          <p>
            Login to manage your bookings and
            discover your next perfect stay.
          </p>

        </div>

      </div>


      <div className="login-right">

        <div className="login-container">

          <div className="login-header">

            <h1>
              Welcome Back
            </h1>

            <p>
              Login to your account to continue.
            </p>

          </div>


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            <div className="login-form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>

              </div>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>


            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>


          <div className="login-divider">

            <span></span>

            <p>OR</p>

            <span></span>

          </div>


          <button
            type="button"
            className="login-google-btn"
            onClick={handleGoogleLogin}
          >

            <span className="login-google-icon">
              G
            </span>

            Continue with Google

          </button>


          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;