import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../Styles/AdminHotelForm.css";

import {
  postHotel,
  getHotelById,
  putHotel,
  deleteHotelImage,
} from "../../apis/adminApi.js";

const AdminHotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phoneNumber: "",
    callStatus: "available",
    description: "",
    rating: "",
    pricePerNight: "",
    totalRooms: "",
    amenities: "",
  });

 
  const [selectedImages, setSelectedImages] = useState([]);

  
  const [imagePreviews, setImagePreviews] = useState([]);

  // Existing images
  const [existingImages, setExistingImages] = useState([]);



  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchHotel = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await getHotelById(id);


        const hotel =
          response.data?.hotel ||
          response.data?.data?.hotel ||
          response.data?.data;

        if (!hotel) {
          setError("Hotel not found");
          return;
        }


        // =====================================================
        // AMENITIES
        // =====================================================

        let amenityText = "";

        if (Array.isArray(hotel.amenities)) {
          amenityText =
            hotel.amenities.join(", ");
        } else if (
          typeof hotel.amenities === "string"
        ) {
          amenityText =
            hotel.amenities;
        }


        setFormData({
          name:
            hotel.name || "",

          location:
            hotel.location || "",

          phoneNumber:
            hotel.phoneNumber ??
            hotel.phone_number ??
            "",

          callStatus:
            hotel.callStatus ??
            hotel.call_status ??
            "available",

          description:
            hotel.description || "",

          rating:
            hotel.rating ?? "",

          pricePerNight:
            hotel.pricePerNight ??
            hotel.price_per_night ??
            "",

          totalRooms:
            hotel.totalRooms ??
            hotel.total_rooms ??
            "",

          amenities:
            amenityText,
        });


        setExistingImages(
          Array.isArray(hotel.images)
            ? hotel.images
            : []
        );

      } catch (error) {

        console.log(
          "Get hotel error:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load hotel"
        );

      } finally {

        setFetching(false);

      }
    };

    fetchHotel();

  }, [id, isEditMode]);



  useEffect(() => {
    return () => {
      imagePreviews.forEach(
        (image) => {
          URL.revokeObjectURL(
            image.url
          );
        }
      );
    };
  }, [imagePreviews]);


 
  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


 
  const handleImageChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    setError("");
    setSuccess("");


    // Maximum 10 new images
    if (files.length > 10) {

      setError(
        "You can select maximum 10 images."
      );

      e.target.value = "";
      return;
    }


    // Image type validation
    const invalidFile =
      files.find(
        (file) =>
          !file.type.startsWith(
            "image/"
          )
      );

    if (invalidFile) {

      setError(
        "Only image files are allowed."
      );

      e.target.value = "";
      return;
    }


    // 5 MB validation
    const largeFile =
      files.find(
        (file) =>
          file.size >
          5 * 1024 * 1024
      );

    if (largeFile) {

      setError(
        "Each image must be less than 5MB."
      );

      e.target.value = "";
      return;
    }


    // Remove old preview URLs
    imagePreviews.forEach(
      (image) => {
        URL.revokeObjectURL(
          image.url
        );
      }
    );


    // Create new previews
    const previews =
      files.map(
        (file) => ({
          file,
          url:
            URL.createObjectURL(
              file
            ),
        })
      );


    setSelectedImages(
      files
    );

    setImagePreviews(
      previews
    );


    // Allow selecting same file again
    e.target.value = "";
  };


  const removeSelectedImage = (
    index
  ) => {

    const preview =
      imagePreviews[index];

    if (preview) {

      URL.revokeObjectURL(
        preview.url
      );

    }


    const updatedFiles =
      selectedImages.filter(
        (_, fileIndex) =>
          fileIndex !== index
      );


    const updatedPreviews =
      imagePreviews.filter(
        (_, previewIndex) =>
          previewIndex !== index
      );


    setSelectedImages(
      updatedFiles
    );

    setImagePreviews(
      updatedPreviews
    );
  };


  const handleDeleteExistingImage =
    async (
      image,
      index
    ) => {

      if (!image?.id) {

        setError(
          "Image ID not found."
        );

        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this image?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setError("");
        setSuccess("");


        await deleteHotelImage(
          id,
          image.id
        );


        // Remove from UI after
        // successful API response
        setExistingImages(
          (prev) =>
            prev.filter(
              (_, imageIndex) =>
                imageIndex !== index
            )
        );


        setSuccess(
          "Image deleted successfully."
        );

      } catch (error) {

        console.log(
          "Delete image error:",
          error.response?.data ||
            error.message
        );


        setError(
          error.response?.data
            ?.message ||
            "Failed to delete image"
        );
      }
    };


  const getAmenityArray = () => {

    if (
      !formData.amenities ||
      !formData.amenities.trim()
    ) {
      return [];
    }


    return formData.amenities
      .split(",")
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);
  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");


    try {

      if (
        !formData.name.trim() ||
        !formData.location.trim()
      ) {

        setError(
          "Hotel name and location are required."
        );

        setLoading(false);
        return;
      }


      if (
        !formData.pricePerNight ||
        Number(
          formData.pricePerNight
        ) <= 0
      ) {

        setError(
          "Please enter a valid price per night."
        );

        setLoading(false);
        return;
      }


      if (
        !formData.totalRooms ||
        Number(
          formData.totalRooms
        ) <= 0
      ) {

        setError(
          "Please enter valid total rooms."
        );

        setLoading(false);
        return;
      }


      if (
        formData.phoneNumber.trim()
      ) {

        const cleanPhone =
          formData.phoneNumber
            .trim()
            .replace(/\s+/g, "")
            .replace(/-/g, "");


        if (
          !/^\+?[0-9]{10,15}$/.test(
            cleanPhone
          )
        ) {

          setError(
            "Please enter a valid phone number."
          );

          setLoading(false);
          return;
        }
      }

      if (
        ![
          "available",
          "busy",
        ].includes(
          formData.callStatus
        )
      ) {

        setError(
          "Invalid call status."
        );

        setLoading(false);
        return;
      }


      // =====================================================
      // AMENITIES ARRAY
      // =====================================================

      const amenityList =
        getAmenityArray();

      const data =
        new FormData();


      data.append(
        "name",
        formData.name.trim()
      );


      data.append(
        "location",
        formData.location.trim()
      );


      // =====================================================
      // PHONE NUMBER
      // =====================================================

      data.append(
        "phoneNumber",
        formData.phoneNumber.trim()
      );


      // =====================================================
      // CALL STATUS
      // =====================================================

      data.append(
        "callStatus",
        formData.callStatus
      );


      data.append(
        "description",
        formData.description.trim()
      );


      data.append(
        "rating",
        formData.rating
      );


      data.append(
        "pricePerNight",
        formData.pricePerNight
      );


      data.append(
        "totalRooms",
        formData.totalRooms
      );


      // =====================================================
      // AMENITIES
      // =====================================================

      data.append(
        "amenities",
        JSON.stringify(
          amenityList
        )
      );


      // =====================================================
      // IMAGES
      // =====================================================

      selectedImages.forEach(
        (file) => {

          data.append(
            "images",
            file
          );

        }
      );


      // =====================================================
      // DEBUG FORMDATA
      // =====================================================

      for (
        const [
          key,
          value,
        ] of data.entries()
      ) {

        console.log(
          "FORM DATA:",
          // key,
          // value
        );

      }


      // =====================================================
      // API CALL
      // =====================================================

      let response;


      if (isEditMode) {

        response =
          await putHotel(
            id,
            data
          );

      } else {

        response =
          await postHotel(
            data
          );

      }

      if (
        response.data?.success
      ) {

        setSuccess(
          isEditMode
            ? "Hotel updated successfully."
            : "Hotel created successfully."
        );


        // Clear new images
        imagePreviews.forEach(
          (image) => {

            URL.revokeObjectURL(
              image.url
            );

          }
        );


        setSelectedImages([]);
        setImagePreviews([]);


        // Redirect
        setTimeout(() => {

          navigate(
            "/admin/hotels"
          );

        }, 800);

      } else {

        setError(
          response.data?.message ||
            "Operation failed."
        );
      }


    } catch (error) {

      console.log(
        "Save hotel error:",
        error.response?.data ||
          error.message
      );


      const backendError =
        error.response?.data;


      if (
        backendError?.errors
          ?.length > 0
      ) {

        setError(
          backendError.errors
            .map(
              (item) =>
                item.message
            )
            .join(", ")
        );

      } else {

        setError(
          backendError?.message ||
            "Failed to save hotel."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (fetching) {

    return (
      <div className="admin-form-loading">
        Loading hotel...
      </div>
    );
  }


  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="admin-hotel-form-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="admin-form-header">

        <div>

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate(
                "/admin/hotels"
              )
            }
          >
            ← Back to Hotels
          </button>


          <h1>
            {isEditMode
              ? "Edit Hotel"
              : "Add New Hotel"}
          </h1>


          <p>
            {isEditMode
              ? "Update hotel information"
              : "Add a new hotel to Stayora"}
          </p>

        </div>

      </div>


      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}


      {/* =====================================================
          SUCCESS
          ===================================================== */}

      {success && (
        <div className="admin-form-success">
          {success}
        </div>
      )}


      {/* =====================================================
          FORM
          ===================================================== */}

      <form
        className="admin-hotel-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            BASIC INFORMATION
            ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <h2>
              Basic Information
            </h2>

            <p>
              Enter the basic details of the hotel.
            </p>

          </div>


          <div className="form-grid">

            {/* =================================================
                HOTEL NAME
                ================================================= */}

            <div className="form-group">

              <label htmlFor="name">
                Hotel Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter hotel name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* =================================================
                LOCATION
                ================================================= */}

            <div className="form-group">

              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                type="text"
                name="location"
                placeholder="e.g. Mumbai, India"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* =================================================
                PHONE NUMBER
                ================================================= */}

            <div className="form-group">

              <label htmlFor="phoneNumber">
                Hotel Mobile Number
              </label>

              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="e.g. +919876543210"
                value={
                  formData.phoneNumber
                }
                onChange={
                  handleChange
                }
                maxLength="15"
              />

              <small>
                This number will be used for hotel calls.
              </small>

            </div>


            {/* =================================================
                CALL STATUS
                ================================================= */}

            <div className="form-group">

              <label htmlFor="callStatus">
                Call Status
              </label>

              <select
                id="callStatus"
                name="callStatus"
                value={
                  formData.callStatus
                }
                onChange={
                  handleChange
                }
              >

                <option value="available">
                  Available
                </option>

                <option value="busy">
                  Busy
                </option>

              </select>

              <small>
                Available means the hotel can receive calls.
              </small>

            </div>


            {/* =================================================
                RATING
                ================================================= */}

            <div className="form-group">

              <label htmlFor="rating">
                Rating
              </label>

              <input
                id="rating"
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                placeholder="e.g. 4.5"
                value={
                  formData.rating
                }
                onChange={
                  handleChange
                }
              />

            </div>


            {/* =================================================
                PRICE
                ================================================= */}

            <div className="form-group">

              <label htmlFor="pricePerNight">
                Price Per Night
              </label>

              <input
                id="pricePerNight"
                type="number"
                name="pricePerNight"
                min="1"
                placeholder="e.g. 5000"
                value={
                  formData.pricePerNight
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* =================================================
                TOTAL ROOMS
                ================================================= */}

            <div className="form-group">

              <label htmlFor="totalRooms">
                Total Rooms
              </label>

              <input
                id="totalRooms"
                type="number"
                name="totalRooms"
                min="1"
                placeholder="e.g. 100"
                value={
                  formData.totalRooms
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

          </div>


          {/* =================================================
              DESCRIPTION
              ================================================= */}

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Enter hotel description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
            />

          </div>

        </div>


        {/* =================================================
            AMENITIES
            ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <h2>
              Amenities
            </h2>

            <p>
              Add amenities separated by commas.
            </p>

          </div>


          <div className="form-group">

            <label htmlFor="amenities">
              Hotel Amenities
            </label>

            <textarea
              id="amenities"
              name="amenities"
              rows="4"
              placeholder="Free WiFi, Pool, Parking"
              value={
                formData.amenities
              }
              onChange={
                handleChange
              }
            />

            <small>
              Example: Free WiFi, Pool, Parking
            </small>

          </div>

        </div>


        {/* =================================================
            IMAGES
            ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <h2>
              Hotel Images
            </h2>

            <p>
              Upload up to 10 images. Maximum 5MB per image.
            </p>

          </div>


          {/* =================================================
              EXISTING IMAGES
              ================================================= */}

          {isEditMode &&
            existingImages.length >
              0 && (

            <div className="existing-images-section">

              <h3>
                Existing Images
              </h3>


              <div className="image-preview-grid">

                {existingImages.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      className="image-preview-card"
                      key={
                        image.id ||
                        image.public_id ||
                        index
                      }
                    >

                      <img
                        src={
                          image.url ||
                          image.image_url
                        }
                        alt={`Hotel ${index + 1}`}
                      />


                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          handleDeleteExistingImage(
                            image,
                            index
                          )
                        }
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* =================================================
              UPLOAD
              ================================================= */}

          <label
            htmlFor="hotel-images"
            className="image-upload-box"
          >

            <div className="upload-icon">
              ↑
            </div>

            <strong>
              Click to upload images
            </strong>

            <span>
              JPG, JPEG, PNG or WEBP
            </span>

          </label>


          <input
            id="hotel-images"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={
              handleImageChange
            }
            style={{
              display: "none",
            }}
          />


          {/* =================================================
              NEW IMAGE PREVIEW
              ================================================= */}

          {imagePreviews.length >
            0 && (

            <div className="new-images-section">

              <h3>
                New Images
              </h3>


              <div className="image-preview-grid">

                {imagePreviews.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      className="image-preview-card"
                      key={`${image.file.name}-${index}`}
                    >

                      <img
                        src={
                          image.url
                        }
                        alt={`Preview ${index + 1}`}
                      />


                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          removeSelectedImage(
                            index
                          )
                        }
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            ACTIONS
            ================================================= */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate(
                "/admin/hotels"
              )
            }
            disabled={loading}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="save-hotel-btn"
            disabled={loading}
          >

            {loading
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
              ? "Update Hotel"
              : "Add Hotel"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default AdminHotelForm;