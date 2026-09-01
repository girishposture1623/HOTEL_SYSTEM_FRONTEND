import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../Styles/AuthError.css'

const AuthError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 10000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-error-page">
      <div className="auth-error-card">

        <h1>Too Many Attempts</h1>

        <p>
          You have made too many authentication attempts.
        </p>

        <p>
          Please wait <strong>10 minutes</strong> and try again.
        </p>

        <p>
          Redirecting to login in a few seconds...
        </p>

        <button onClick={() => navigate("/login")}>
          Go to Login
        </button>

      </div>
    </div>
  );
};

export default AuthError;