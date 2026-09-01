import api from "./api.js";

const register = (data) => {
  return api.post("/auth/register", data);
};

const verifyOtp = (otp) => {
  return api.post("/auth/verify-otp", otp);
};

const login = (data) => {
  return api.post("/auth/login", data);
};

const currentUser = () => {
  return api.get("/auth/me");
};

const logOut = () => {
  return api.post("/auth/logout");
};

const googleAuth = () => {
  return api.get("/auth/google");
};
const googleCallback = () => {
  return api.get("/auth/google/callback");
};
export {
  register,
  verifyOtp,
  login,
  currentUser,
  logOut,
  googleCallback,
  googleAuth,
};
