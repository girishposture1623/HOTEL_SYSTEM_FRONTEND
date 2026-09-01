import api from "./api.js";


const getHotels = async (params = {}) => {
  const response = await api.get(
    "/home/hotels",
    {
      params: {
        search: params.search || "",
        location: params.location || "",
        minPrice: params.minPrice || "",
        maxPrice: params.maxPrice || "",
        minRating: params.minRating || "",
        sort: params.sort || "newest",
      },
    }
  );

  return response.data;
};



const getHotelById = (id) => {
  return api.get(
    `/home/hotels/${id}`
  );
};


export {
  getHotels,
  getHotelById,
};