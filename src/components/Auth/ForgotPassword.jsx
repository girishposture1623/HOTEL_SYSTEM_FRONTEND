import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/ForgotPassword.css";
import api from "../../apis/api";
api

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      

      if (response.data.success) {
        navigate("/forgot-password/verify-otp", {
          state: {
            email,
          },
        });
      }
    } catch (error) {
      console.log(
        "FORGOT PASSWORD ERROR:",
        error.response?.data || error.message,
      );
    }
    setLoading(false);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-icon">🔐</div>

        <h1>Forgot Password?</h1>

        <p>
          Enter your registered email address and we'll send you an OTP to reset
          your password.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <Link to="/login" className="back-login">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
