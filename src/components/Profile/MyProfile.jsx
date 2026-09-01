import Navbar from "../Navbar.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";

import "../../Styles/MyProfile.css";

const MyProfile = () => {
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

            <h2>
              Profile not found
            </h2>

            <p>
              Please login again.
            </p>

          </div>
        </div>
      </>
    );
  }

  const name =
    user.name ||
    user.fullName ||
    "User";

  const email =
    user.email ||
    "-";

  

  const profileImage =
    user.profileImage ||
    user.profile_image ||
    user.image ||
    null;

  return (
    <>
      <Navbar />

      <main className="profile-page">

        <div className="profile-card">

          <div className="profile-title">

            <h1>
              My Profile
            </h1>

            <p>
              Manage your account information
            </p>

          </div>


          {/* PROFILE IMAGE */}

          <div className="profile-image-wrapper">

            {profileImage ? (

              <img
                src={profileImage}
                alt={name}
                className="profile-image"
              />

            ) : (

              <div className="profile-image-placeholder">

                {name
                  .charAt(0)
                  .toUpperCase()}

              </div>

            )}

          </div>


          {/* PROFILE INFORMATION */}

          <div className="profile-info">

            <div className="profile-field">

              <span>
                Full Name
              </span>

              <strong>
                {name}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Email Address
              </span>

              <strong>
                {email}
              </strong>

            </div>


            <div className="profile-field">

              <span>
                Account Status
              </span>

              <strong className="verified-status">
                ✓ Verified
              </strong>

            </div>

          </div>

        </div>

      </main>
    </>
  );
};

export default MyProfile;