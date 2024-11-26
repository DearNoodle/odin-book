import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl, UserIdContext } from "../../App";
import axios from "axios";
import PostCard from "../../components/PostCard";
import NavBar from "../../components/NavBar";

function UserPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const { id: pageUserId } = useParams();
  const [pageUserInfo, setPageUserInfo] = useState();
  const [pageUserPosts, setPageUserPosts] = useState([]);
  const [followStatus, setFollowStatus] = useState(false);

  const [postTitle, setPostTitle] = useState("");
  const [postImageFile, setPostImageFile] = useState(null);
  const [postContent, setPostContent] = useState("");

  async function fetchData() {
    try {
      const response = await axios.get(
        `${apiUrl}/user-page/user/${pageUserId}`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      setPageUserInfo(data.userInfo);
      setPageUserPosts(data.posts || []);
      setFollowStatus(data.followStatus);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function handleUpdateFollow(req) {
    if (userId !== pageUserId) {
      try {
        await axios.put(
          `${apiUrl}/follow/user/${pageUserId}`,
          {},
          { withCredentials: true }
        );
        fetchData();
      } catch (error) {
        console.error("Error updating follow status:", error);
      }
    } else {
      console.error("Self Following Action Denied.");
    }
  }

  async function handleCreatePost(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", postTitle);
    if (postImageFile) {
      formData.append("image", postImageFile);
    }
    formData.append("content", postContent);

    try {
      await axios.post(`${apiUrl}/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      fetchData();
      setPostTitle("");
      setPostImageFile(null);
      setPostContent("");
    } catch (error) {
      console.error("Error creating post:", error);
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
        <div className="flex flex-col items-center">
          <img
            src={pageUserInfo?.avatarUrl || "/placeholder.jpg"} // Placeholder image
            alt={`${pageUserInfo?.username}'s avatar`}
            className="w-32 h-32 rounded-full mb-4"
          />
          <h1 className="text-3xl font-semibold mb-2">
            {pageUserInfo?.username}
          </h1>
          <p className="text-gray-600 mb-4">{pageUserInfo?.bio}</p>
          <p className="text-gray-600">
            {pageUserInfo?._count?.followedBy || 0} Followers
          </p>
          {userId !== pageUserId && (
            <>
              <Link
                to={`/chat/user/${pageUserId}`}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300 mb-2"
              >
                Chat
              </Link>
              <button
                onClick={handleUpdateFollow}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {followStatus ? "Unfollow" : "Follow"}
              </button>
            </>
          )}
        </div>
      </div>

      {userId === pageUserId && (
        <form
          onSubmit={handleCreatePost}
          className="mx-auto space-y-4 border border-gray-300 rounded p-4 my-4 max-w-lg shadow-md"
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Post Title
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Post Image (Optional)
            <input
              type="file"
              onChange={(e) => setPostImageFile(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Post Content
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Post
          </button>
        </form>
      )}

      <h2 className="text-xl font-semibold mb-4">
        {userId === pageUserId ? "Your" : pageUserInfo?.username} Posts (
        {pageUserInfo?._count?.posts || 0})
      </h2>

      <div className="space-y-4">
        {pageUserPosts.length === 0 ? (
          <p className="text-gray-500">No post yet.</p>
        ) : (
          pageUserPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default UserPage;
