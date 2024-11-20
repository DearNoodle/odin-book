import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";
import axios from "axios";
import NavBar from "../components/NavBar";
import PostCard from "../components/PostCard";

function HomePage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const [recentPosts, setRecentPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState();

  async function fetchData() {
    const response = await axios.get(`${apiUrl}/home-page`, {
      withCredentials: true,
    });
    setRecentPosts(response.data);
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    if (searchKeyword !== "") {
      const response = await axios.get(`${apiUrl}/search/posts`, {
        params: {
          searchKeyword,
        },
        withCredentials: true,
      });
      setSearchResults(response.data);
    } else {
      setSearchResults(undefined);
    }
  }

  async function handleKeywordChange(event) {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setSearchResults(undefined);
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
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Discover Posts..."
            value={searchKeyword}
            onChange={handleKeywordChange}
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
        {searchResults ? "Search Results" : "Recent Posts"}
      </h2>
      <div className="space-y-4">
        {searchResults?.length === 0 ? (
          <p className="text-gray-500">No Result found.</p>
        ) : searchResults ? (
          searchResults.map((post) => <PostCard key={post.id} post={post} />)
        ) : recentPosts.length === 0 ? (
          <p className="text-gray-500">No post yet.</p>
        ) : (
          recentPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default HomePage;
