import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";
import axios from "axios";

function PostPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);

  useEffect(() => {
    if (!userId) {
      navigate("/home");
      return;
    }
  }, []);
  return (
    <div className="mx-auto px-4 py-8 min-h-screen max-w-7xl">
      <div className="flex justify-start items-center mb-6">
        <Link
          to="/home"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Back
        </Link>
      </div>
    </div>
  );
}

export default PostPage;
