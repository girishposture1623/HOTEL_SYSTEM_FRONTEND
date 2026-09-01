import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../apis/api.js";
import "../../Styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

     

      setSuccess(response.data.message || "OTP sent to your email.");

      navigate("/verify-otp", {
        state: {
          email: formData.email,
        },
      });
    } catch (error) {
      console.log("Register error:", error.response?.data || error.message);

      const backendError = error.response?.data;

      if (backendError?.errors?.length > 0) {
        setError(backendError.errors.map((item) => item.message).join(", "));
      } else {
        setError(
          backendError?.message || "Registration failed. Please try again.",
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
    <div className="register-page">
      {/* LEFT SIDE */}

      <div className="register-left">
        <div className="register-brand" onClick={()=> navigate('/')} role="button">
          <div className="brand-logo">S</div>

          <div>
            <h2>Stayora</h2>

            <span>HOTELS & RESORTS</span>
          </div>
        </div>

        <div className="register-left-content">
          <h1>
            Find your perfect
            <br />
            stay with us.
          </h1>

          <p>
            Discover comfortable hotels, beautiful destinations and
            unforgettable stays.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="register-right">
        <div className="register-container">
          <div className="register-header">
            <h1>Create Account</h1>

            <p>Create your account to start booking your perfect stay.</p>
          </div>

          {/* ERROR */}

          {error && <div className="auth-error">{error}</div>}

          {/* SUCCESS */}

          {success && <div className="auth-success">{success}</div>}

          {/* FORM */}

          <form className="register-form" onSubmit={handleSubmit}>
            {/* NAME */}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>

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

            {/* PASSWORD */}

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* REGISTER */}

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          {/* DIVIDER */}

          <div className="auth-divider">
            <span></span>

            <p>OR</p>

            <span></span>
          </div>

          {/* GOOGLE */}

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          {/* LOGIN */}

          <div className="login-link">
            <span>Already have an account?</span>

            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
