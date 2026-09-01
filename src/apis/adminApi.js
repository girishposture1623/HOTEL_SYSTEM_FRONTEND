import api from "./api.js";

const getHotels = () => {
  return api.get("/admin/hotels", {
    params: {
      page: 1,
      limit: 100,
    },
  });
};


const getHotelById = (id) => {
  return api.get(
    `/admin/hotels/${id}`
  );
};


const postHotel = (data) => {
  return api.post(
    "/admin/hotels",
    data
  );
};


const putHotel = (id, data) => {
  return api.patch(
    `/admin/hotels/${id}`,
    data
  );
};


const deletHotel = (id) => {
  return api.delete(
    `/admin/hotels/${id}`
  );
};


const deleteHotelImage = (
  hotelId,
  imageId
) => {
  return api.delete(
    `/admin/hotels/${hotelId}/images/${imageId}`
  );
};


const hotelAvailability = () => {
  return api.get(
    "/admin/hotel-availability"
  );
};



const getBooking = () => {
  return api.get(
    "/admin/bookings"
  );
};


const changeBookingStatus = (
  id,
  status
) => {
  return api.patch(
    `/admin/bookings/${id}/status`,
    {
      status,
    }
  );
};


const bookingOverview = () => {
  return api.get(
    "/admin/booking-overview"
  );
};


const revenueOverview = () => {
  return api.get(
    "/admin/revenue-overview"
  );
};



const allUsers = () => {
  return api.get(
    "/admin/users"
  );
};


const getUsersById = (id) => {
  return api.get(
    `/admin/users/${id}`
  );
};


const updateUser = (
  id,
  data
) => {
  return api.put(
    `/admin/users/${id}`,
    data
  );
};


const deleteUser = (id) => {
  return api.delete(
    `/admin/users/${id}`
  );
};


const dashBoard = () => {
  return api.get(
    "/admin/dashboard"
  );
};

export {
  getHotels,
  getHotelById,
  postHotel,
  putHotel,
  deletHotel,
  deleteHotelImage,
  hotelAvailability,

  getBooking,
  changeBookingStatus,
  bookingOverview,
  revenueOverview,

  allUsers,
  getUsersById,
  updateUser,
  deleteUser,

  dashBoard,
};