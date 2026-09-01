import { useAuth } from "../../Context/AuthContext.jsx";
import Navbar from "../Navbar.jsx";
import "../../Styles/Profile.css";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="profile-loading">
          Loading profile...
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="profile-page">
          <div className="profile-card">
            <h2>Please login to view your profile.</h2>
          </div>
        </div>
      </>
    );
  }

  const userName =
    user?.name ||
    user?.fullName ||
    "User";

  const userEmail =
    user?.email ||
    "-";

  const userRole =
    String(user?.role || "").toLowerCase();

  return (
    <>
      <Navbar />

      <main className="profile-page">

        <div className="profile-card">

          {/* =================================================
              HEADER
              ================================================= */}

          <div className="profile-header">

            <h1>
              My Profile
            </h1>

            <p>
              View your account information
            </p>

          </div>


          {/* =================================================
              PROFILE AVATAR
              ================================================= */}

          <div className="profile-avatar-section">

            <div className="profile-avatar">

              {userName
                .charAt(0)
                .toUpperCase()}

            </div>

          </div>


          {/* =================================================
              PROFILE DETAILS
              ================================================= */}

          <div className="profile-details">

            {/* FULL NAME */}

            <div className="profile-detail-item">

              <span className="profile-detail-label">
                Full Name
              </span>

              <strong className="profile-detail-value">
                {userName}
              </strong>

            </div>


            {/* EMAIL */}

            <div className="profile-detail-item">

              <span className="profile-detail-label">
                Email Address
              </span>

              <strong className="profile-detail-value">
                {userEmail}
              </strong>

            </div>


            {/* ROLE */}

            <div className="profile-detail-item">

              <span className="profile-detail-label">
                Account Type
              </span>

              <strong className="profile-detail-value">
                {userRole === "admin"
                  ? "Administrator"
                  : "Customer"}
              </strong>

            </div>


            {/* ACCOUNT STATUS */}

            <div className="profile-detail-item">

              <span className="profile-detail-label">
                Account Status
              </span>

              <strong className="profile-status">
                ✓ Verified
              </strong>

            </div>

          </div>

        </div>

      </main>
    </>
  );
};

export default Profile;