import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserIdContext } from "../App";

function MainPage() {
  const navigate = useNavigate();
  const { userId } = useContext(UserIdContext);

  useEffect(() => {
    if (userId) {
      navigate("/home");
      return;
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to WhatsUpp!</h1>
      <p className="text-lg text-gray-700 mb-10">
        Share your thoughts, ideas, and stories with the world.
      </p>

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
