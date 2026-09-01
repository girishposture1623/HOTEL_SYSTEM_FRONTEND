import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../apis/api";
import "../../Styles/VerifyOTP.css";

const VerifyResetOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/verify-reset-otp",
        {
          email,
          otp,
        }
      );



      if (response.data.success) {
        navigate("/reset-password", {
          state: {
            email,
            otp,
          },
        });
      }
    } catch (error) {
      console.log(
        "VERIFY RESET OTP ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">

      <div className="otp-card">

        <div className="otp-icon">
          🔐
        </div>

        <h1>
          Verify OTP
        </h1>

        <p>
          Enter the OTP sent to
        </p>

        <strong className="otp-email">
          {email}
        </strong>

        {error && (
          <div className="otp-error">
            {error}
          </div>
        )}

        {message && (
          <div className="otp-success">
            {message}
          </div>
        )}

        <form
          className="otp-form"
          onSubmit={handleSubmit}
        >

          <label htmlFor="otp">
            Enter OTP
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            required
          />

          <button
            type="submit"
            className="verify-btn"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        <button
          type="button"
          className="back-login"
          onClick={() =>
            navigate("/forgot-password")
          }
        >
          ← Back
        </button>

      </div>

    </div>
  );
};

export default VerifyResetOTP;