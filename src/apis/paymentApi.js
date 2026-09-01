import api from "./api.js";


const createPaymentOrder = (bookingId) => {
  return api.post("/payments/create-order", {
    bookingId,
  });
};



const verifyPayment = (data) => {
  return api.post("/payments/verify", data);
};



const paymentFailed = (bookingId) => {
  return api.post("/payments/failed", {
    bookingId,
  });
};


export {
  createPaymentOrder,
  verifyPayment,
  paymentFailed,
};