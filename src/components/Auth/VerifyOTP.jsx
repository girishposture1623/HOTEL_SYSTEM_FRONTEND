import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../Styles/VerifyOTP.css";
import api from "../../apis/api";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setError("");

  try {
    const response = await api.post("/auth/verify-otp", {
      email: email,
      otp: otp,
    });



    if (response.data.success) {
      setMessage(
        response.data.message ||
          "Email verified successfully"
      );

      navigate("/login");
    }
  } catch (error) {
    console.log(
      "VERIFY OTP ERROR:",
      error.response?.data || error.message
    );

    setError(
      error.response?.data?.message ||
        "Invalid OTP or email"
    );
  }
};

  const handleResend = async () => {
    setResending(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/auth/resend-otp", {
        email,
      });

     

      setMessage(response.data.message || "New OTP sent successfully");
    } catch (error) {
      console.log("RESEND OTP ERROR:", error.response?.data || error.message);

      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <div className="otp-icon">✉</div>

        <h1>Verify Your Email</h1>

        <p>We have sent a verification code to</p>

        <strong className="otp-email">{email || "your email address"}</strong>

        <form className="otp-form" onSubmit={handleSubmit}>
          <label htmlFor="otp">Enter OTP</label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
          />

          <button type="submit" className="verify-btn">
            Verify OTP
          </button>
        </form>

        <div className="resend-section">
          <span>Didn't receive the code?</span>

          <button type="button" onClick={handleResend} disabled={resending}>
            Resend OTP
            {resending ? "Sending..." : "Resend OTP"}
          </button>
          {message && <div className="otp-success">{message}</div>}

          {error && <div className="otp-error">{error}</div>}
        </div>

        <button
          type="button"
          className="back-login"
          onClick={() => navigate("/register")}
        >
          ← Back to Register
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
