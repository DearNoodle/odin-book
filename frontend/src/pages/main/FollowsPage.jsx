import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, UserIdContext } from "../../App";
import axios from "axios";
import NavBar from "../../components/NavBar";
function FollowsPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get(`${apiUrl}/follows-page`, {
        withCredentials: true,
      });
      setFollowedUsers(response.data);
    } catch (error) {
      console.error("Error fetching followed users:", error);
    }
  }
  
  async function handleSearch(event) {
    event.preventDefault();
    const trimmedKeyword = searchKeyword.trim();
    if (trimmedKeyword !== "") {
      try {
        const response = await axios.get(`${apiUrl}/search/users`, {
          params: {
            searchKeyword: trimmedKeyword,
          },
          withCredentials: true,
        });
        setSearchedUsers(response.data);
      } catch (error) {
        console.error("Error performing user search:", error);
      }
    } else {
      setSearchKeyword("");
    }
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <NavBar userId={userId} setUserId={setUserId} />

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-8">
          <input
            type="text"
            placeholder="Search for Users..."
            value={searchKeyword}
            required
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Search
          </button>
        </form>
      </div>

      <p className="text-xl font-semibold mb-4">
        {searchedUsers.length > 0 ? "Search Results" : "Your Follows"}
      </p>

      <div className="space-y-4">
        {searchedUsers.length > 0 ? (
          searchedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow rounded-md p-4 flex items-center justify-between"
            >
              <p className="font-bold text-lg text-gray-800">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </p>
              <Link
                to={`/user/${user.id}`}
                className="bg-purple-500 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 "
              >
                View
              </Link>
            </div>
          ))
        ) : followedUsers.length > 0 ? (
          followedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow rounded-md p-4 flex items-center justify-between"
            >
              <p className="font-bold text-lg text-gray-800">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </p>
              <Link
                to={`/user/${user.id}`}
                className="bg-purple-500 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2"
              >
                View
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No followed user yet.</p>
        )}
      </div>
    </div>
  );
}

export default FollowsPage;
