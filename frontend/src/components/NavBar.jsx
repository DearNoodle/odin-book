import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";
import axios from "axios";

function NavBar({ userId, setUserId }) {
  const navigate = useNavigate();

  async function handleLogout(event) {
    event.preventDefault();
    try {
      await axios.post(`${apiUrl}/logout`, null, {
        withCredentials: true,
      });
      setUserId(null);
      navigate("/");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="flex justify-between items-center mb-6">
      <Link
        to="/home"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Explore
      </Link>
      <Link
        to="/follows"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Follows
      </Link>
      <Link
        to={`/user/${userId}`}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Posts
      </Link>
      <Link
        to="/chats"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Chats
      </Link>
      <Link
        to="/profile"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Profile
      </Link>
      <form onSubmit={handleLogout}>
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Logout
        </button>
      </form>
    </nav>
  );
}

export default NavBar;
