import api from "./api.js";

const checkAvailability = (data) => {
  return api.post(
    "/bookings/availability",
    data
  );
};

const createBooking = (data) => {
  return api.post(
    "/bookings",
    data
  );
};

const getMyBookings = () => {
  return api.get(
    "/bookings/my-bookings"
  );
};

const getBookingById = (id) => {
  return api.get(
    `/bookings/${id}`
  );
};

const cancelBooking = (id) => {
  return api.patch(
    `/bookings/${id}/cancel`
  );
};


export {
  checkAvailability,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};