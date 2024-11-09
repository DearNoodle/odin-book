import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";
import axios from "axios";
import NavBar from "../components/NavBar";
function FollowsPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const [recentChats, setRecentChats] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  async function getRecentChat() {
    const response = await axios.get(`${apiUrl}/recent-chat`, {
      withCredentials: true,
    });
    setRecentChats(response.data);
  }

  async function handleSearch(event) {
    event.preventDefault();
    const response = await axios.get(`${apiUrl}/search/user`, {
      params: {
        searchKeyword,
      },
      withCredentials: true,
    });
    setSearchResults(response.data);
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    getRecentChat();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <NavBar setUserId={setUserId} />

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchKeyword}
            required
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Search
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">
        {searchResults.length > 0 ? "Search Results" : "Recent Conversations"}
      </h2>

      <div className="space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow rounded-md p-4 flex items-center justify-between"
            >
              <p className="font-bold text-lg text-gray-800">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </p>
              <Link
                to={`/chat/${user.id}`}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Chat
              </Link>
            </div>
          ))
        ) : recentChats.length > 0 ? (
          recentChats.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow rounded-md p-4 flex items-center justify-between"
            >
              <p className="font-bold text-lg text-gray-800">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </p>
              <Link
                to={`/chat/${user.id}`}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Chat
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent chats yet.</p>
        )}
      </div>
    </div>
  );
}

export default FollowsPage;
