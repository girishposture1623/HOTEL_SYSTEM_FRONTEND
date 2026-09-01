import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../apis/api";
import "../../Styles/ResetPassword.css";


const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [password, setPassword] = useState("");
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
        "/auth/reset-password",
        {
          email,
          otp,
          password,
        }
      );



      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Password reset successfully"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      console.log(
        "RESET PASSWORD ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">

      <div className="reset-card">

        <div className="reset-icon">
          🔐
        </div>

        <h1>
          Reset Password
        </h1>

        <p>
          Create a new password for your account.
        </p>

        {error && (
          <div className="reset-error">
            {error}
          </div>
        )}

        {message && (
          <div className="reset-success">
            {message}
          </div>
        )}

        <form
          className="reset-form"
          onSubmit={handleSubmit}
        >

          <div className="reset-form-group">

            <label htmlFor="password">
              New Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="reset-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>

        </form>

        <button
          type="button"
          className="reset-back"
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
};

export default ResetPassword;