import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels } from "../apis/hotelApi.js";

import "../Styles/SearchBar.css";

import LocationImage from "../assets/location.png";
import CalImage from "../assets/calendar.png";
import AdultsImage from "../assets/user.png";
import ChildImage from "../assets/icons8-children-50.png";
import RoomImage from "../assets/icons8-bed-50.png";
import SearchImage from "../assets/icons8-search-50 (1).png";

const SearchBar = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    search: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const [loading, setLoading] =
    useState(false);


  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSearch = async (e) => {
    e.preventDefault();

  
    if (
      !searchData.search.trim()
    ) {
      alert(
        "Please enter a destination."
      );

      return;
    }

 
    if (
      searchData.checkIn &&
      searchData.checkOut &&
      searchData.checkOut <=
        searchData.checkIn
    ) {
      alert(
        "Check-out date must be after check-in date."
      );

      return;
    }

    try {
      setLoading(true);


  
      const response =
        await getHotels({
          search:
            searchData.search.trim(),
        });

  

      const hotels =
        Array.isArray(
          response?.hotels
        )
          ? response.hotels
          : [];

    
      navigate(
        "/hotels",
        {
          state: {
            searchData: {
              ...searchData,

              adults:
                Number(
                  searchData.adults
                ),

              children:
                Number(
                  searchData.children
                ),

              rooms:
                Number(
                  searchData.rooms
                ),
            },

            hotels,
          },
        }
      );

    } catch (error) {

      console.error(
        "Hotel search error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data
          ?.message ||
          "Unable to search hotels. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      className="search-box"
      onSubmit={
        handleSearch
      }
    >


      <div className="search-field">

        <img
          src={LocationImage}
          alt="Location"
        />

        <div>

          <label htmlFor="search">
            Destination
          </label>

          <input
            id="search"
            type="text"
            name="search"
            value={
              searchData.search
            }
            onChange={
              handleChange
            }
            placeholder="Goa, India"
            required
          />

        </div>

      </div>

      <div className="search-field">

        <img
          src={CalImage}
          alt="Check-in"
        />

        <div>

          <label htmlFor="checkIn">
            Check-in
          </label>

          <input
            id="checkIn"
            type="date"
            name="checkIn"
            value={
              searchData.checkIn
            }
            onChange={
              handleChange
            }
          />

        </div>

      </div>


      <div className="search-field">

        <img
          src={CalImage}
          alt="Check-out"
        />

        <div>

          <label htmlFor="checkOut">
            Check-out
          </label>

          <input
            id="checkOut"
            type="date"
            name="checkOut"
            value={
              searchData.checkOut
            }
            onChange={
              handleChange
            }
          />

        </div>

      </div>


      <div className="search-field">

        <img
          src={AdultsImage}
          alt="Adults"
        />

        <div>

          <label htmlFor="adults">
            Adults
          </label>

          <br />

          <select
            id="adults"
            name="adults"
            value={
              searchData.adults
            }
            onChange={
              handleChange
            }
          >

            <option value="1">
              1 Adult
            </option>

            <option value="2">
              2 Adults
            </option>

            <option value="3">
              3 Adults
            </option>

            <option value="4">
              4 Adults
            </option>

            <option value="5">
              5 Adults
            </option>

            <option value="6">
              6 Adults
            </option>

          </select>

        </div>

      </div>



      <div className="search-field">

        <img
          src={ChildImage}
          alt="Children"
        />

        <div>

          <label htmlFor="children">
            Children
          </label>

          <br />

          <select
            id="children"
            name="children"
            value={
              searchData.children
            }
            onChange={
              handleChange
            }
          >

            <option value="0">
              0 Children
            </option>

            <option value="1">
              1 Child
            </option>

            <option value="2">
              2 Children
            </option>

            <option value="3">
              3 Children
            </option>

            <option value="4">
              4 Children
            </option>

          </select>

        </div>

      </div>

      <div className="search-field">

        <img
          src={RoomImage}
          alt="Rooms"
        />

        <div>

          <label htmlFor="rooms">
            Rooms
          </label>

          <br />

          <select
            id="rooms"
            name="rooms"
            value={
              searchData.rooms
            }
            onChange={
              handleChange
            }
          >

            <option value="1">
              1 Room
            </option>

            <option value="2">
              2 Rooms
            </option>

            <option value="3">
              3 Rooms
            </option>

            <option value="4">
              4 Rooms
            </option>

            <option value="5">
              5 Rooms
            </option>

          </select>

        </div>

      </div>

      <button
        type="submit"
        className="search-button"
        disabled={loading}
      >

        <img
          src={SearchImage}
          alt="Search"
        />

        {loading
          ? "Searching..."
          : "Search"}

      </button>

    </form>
  );
};

export default SearchBar;