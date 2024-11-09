import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";
import axios from "axios";
import NavBar from "../components/NavBar";

function HomePage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const [recentPosts, setRecentPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  async function getRecentPost() {
    const response = await axios.get(`${apiUrl}/posts/recent`, {
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
      setSearchResults([]);
    }
  }

  async function handleKeywordChange(event) {
    setSearchKeyword(event.target.value);
    if (event.target.value === "") {
      setSearchResults([]);
    }
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    getRecentPost();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <NavBar setUserId={setUserId} />

      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Explore Posts..."
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
        {searchResults.length > 0 ? "Search Results" : "Recent Posts"}
      </h2>

      <div className="space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow rounded-md p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center">
                  {post.author.avatarUrl && (
                    <img
                      src={post.author.avatarUrl}
                      alt={`${post.author.username}'s avatar`}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <p className="font-semibold">{post.author.username}</p>
                </div>
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p>{post.content}</p>
                <div className="mt-1">
                  <span>{post._count.likedBy} likes</span>
                </div>
              </div>
              {post.postImageUrl && (
                <img
                  src={post.postImageUrl}
                  alt={`Post ${post.id}`}
                  className="w-24 h-24 rounded-md ml-4 object-cover"
                />
              )}
            </div>
          ))
        ) : recentPosts.length > 0 ? (
          recentPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow rounded-md p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center">
                  {post.author.avatarUrl && (
                    <img
                      src={post.author.avatarUrl}
                      alt={`${post.author.username}'s avatar`}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <p className="font-semibold">{post.author.username}</p>
                </div>
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p>{post.content}</p>
                <div className="mt-1">
                  <span>{post._count.likedBy} likes</span>
                </div>
              </div>
              {post.postImageUrl && (
                <img
                  src={post.postImageUrl}
                  alt={`Post ${post.id}`}
                  className="w-24 h-24 rounded-md ml-4 object-cover"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No post yet.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
