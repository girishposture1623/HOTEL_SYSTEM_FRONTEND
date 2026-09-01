import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  allUsers,
  getUsersById,
  updateUser,
  deleteUser,
} from "../../apis/adminApi.js";

import "../../Styles/AdminUsers.css";


const AdminUsers = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  const fetchUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await allUsers();

      if (!response.data?.success) {

        setError(
          response.data?.message ||
          "Failed to load users"
        );

        return;
      }

      setUsers(
        Array.isArray(response.data.users)
          ? response.data.users
          : []
      );

    } catch (error) {

      console.log(
        "Users fetch error:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load users"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchUsers();

  }, []);


  const handleEdit = async (id) => {

    try {

      const response =
        await getUsersById(id);


      if (!response.data?.success) {

        alert(
          response.data?.message ||
          "Failed to get user"
        );

        return;
      }

      setSelectedUser(
        response.data.user
      );

      setShowModal(true);

    } catch (error) {

      console.log(
        "Get user error:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to get user"
      );

    }

  };



  const closeModal = () => {

    if (saving) {
      return;
    }

    setShowModal(false);

    setSelectedUser(null);

  };


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSelectedUser(
      (prev) => ({
        ...prev,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );

  };


  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdate = async (e) => {

    e.preventDefault();

    if (!selectedUser) {
      return;
    }

    if (!selectedUser.name?.trim()) {

      alert(
        "Name is required"
      );

      return;
    }

    if (
      !["user", "admin"].includes(
        selectedUser.role
      )
    ) {

      alert(
        "Invalid role"
      );

      return;
    }


    try {

      setSaving(true);


      await updateUser(
        selectedUser.id,
        {
          name:
            selectedUser.name.trim(),

          role:
            selectedUser.role,

          is_verified:
            selectedUser.is_verified
              ? true
              : false,
        }
      );


      alert(
        "User updated successfully"
      );


      closeModal();

      await fetchUsers();


    } catch (error) {

      console.log(
        "Update user error:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to update user"
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (
    id,
    name
  ) => {

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${name}?`
      );


    if (!confirmDelete) {
      return;
    }


    try {

      await deleteUser(id);


      alert(
        "User deleted successfully"
      );


      setUsers(
        (prev) =>
          prev.filter(
            (user) =>
              Number(user.id) !==
              Number(id)
          )
      );


    } catch (error) {

      console.log(
        "Delete user error:",
        error.response?.data ||
        error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete user"
      );

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="admin-users-loading">

        <div className="admin-users-spinner"></div>

        <p>
          Loading users...
        </p>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-users-page">


      {/* =================================================
          HEADER
          ================================================= */}

      <header className="admin-users-header">

        <div>

          <button
            className="back-button"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            ← Dashboard
          </button>

          <h1>
            Users
          </h1>

          <p>
            Manage registered users
          </p>

        </div>


        <div className="users-count">

          <span>
            Total Users
          </span>

          <strong>
            {users.length}
          </strong>

        </div>

      </header>


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (

        <div className="users-error">

          {error}

          <button
            onClick={
              fetchUsers
            }
          >
            Try Again
          </button>

        </div>

      )}


      {/* =================================================
          USERS TABLE
          ================================================= */}

      <div className="users-card">

        <div className="users-table-wrapper">

          <table className="users-table">

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  User
                </th>

                <th>
                  Email
                </th>

                <th>
                  Role
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {users.length > 0 ? (

                users.map(
                  (user) => (

                    <tr
                      key={
                        user.id
                      }
                    >

                      {/* ID */}

                      <td>

                        #
                        {user.id}

                      </td>


                      {/* USER */}

                      <td>

                        <div className="user-info">

                          <div className="user-avatar">

                            {(
                              user.name ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <strong>

                            {user.name ||
                              "Unknown User"}

                          </strong>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>

                        {user.email ||
                          "-"}

                      </td>


                      {/* ROLE */}

                      <td>

                        <span
                          className={`role-badge ${
                            user.role ===
                            "admin"
                              ? "admin"
                              : "user"
                          }`}
                        >

                          {user.role ||
                            "user"}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`verify-badge ${
                            user.is_verified
                              ? "verified"
                              : "not-verified"
                          }`}
                        >

                          {user.is_verified
                            ? "Verified"
                            : "Not Verified"}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="user-actions">

                          <button
                            className="edit-user-btn"
                            onClick={() =>
                              handleEdit(
                                user.id
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="delete-user-btn"
                            onClick={() =>
                              handleDelete(
                                user.id,
                                user.name ||
                                  "this user"
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="empty-users"
                  >

                    No users found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          EDIT MODAL
          ================================================= */}

      {showModal &&
        selectedUser && (

          <div
            className="user-modal-overlay"
            onMouseDown={(e) => {

              if (
                e.target ===
                e.currentTarget
              ) {
                closeModal();
              }

            }}
          >

            <div className="user-modal">

              <div className="user-modal-header">

                <div>

                  <h2>
                    Edit User
                  </h2>

                  <p>
                    Update user information
                  </p>

                </div>


                <button
                  className="modal-close"
                  onClick={
                    closeModal
                  }
                >
                  ×
                </button>

              </div>


              <form
                onSubmit={
                  handleUpdate
                }
              >


                {/* NAME */}

                <div className="form-group">

                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      selectedUser.name ||
                      ""
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={
                      selectedUser.email ||
                      ""
                    }
                    disabled
                  />

                </div>


                {/* ROLE */}

                <div className="form-group">

                  <label>
                    Role
                  </label>

                  <select
                    name="role"
                    value={
                      selectedUser.role ||
                      "user"
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="user">
                      User
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </div>


                {/* VERIFIED */}

                <label className="verified-checkbox">

                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={
                      Boolean(
                        selectedUser.is_verified
                      )
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    User is verified
                  </span>

                </label>


                {/* BUTTONS */}

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={
                      closeModal
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="save-btn"
                    disabled={saving}
                  >

                    {saving
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

    </div>

  );

};


export default AdminUsers;