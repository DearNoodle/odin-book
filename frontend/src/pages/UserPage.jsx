import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";
import axios from "axios";
import PostCard from "../components/PostCard";

function UserPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const { id: pageUserId } = useParams();
  const [pageUserInfo, setPageUserInfo] = useState();
  const [pageUserPosts, setPageUserPosts] = useState();
  const [followStatus, setFollowStatus] = useState(false);

  const [postTitle, setPostTitle] = useState("");
  const [postImageFile, setPostImageFile] = useState();
  const [postContent, setPostContent] = useState("");

  async function fetchData() {
    const response = await axios.get(`${apiUrl}/user-page/user/${pageUserId}`, {
      withCredentials: true,
    });
    const data = response.data;
    setPageUserInfo(data.userInfo);
    setPageUserPosts(data.posts);
    setFollowStatus(data.followStatus);
  }

  async function handleUpdateFollow(req) {
    if (userId !== pageUserId) {
      await axios.put(
        `${apiUrl}/follow/user/${pageUserId}`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchData();
    } else {
      console.error("Self Following Action Denied.");
    }
  }

  async function handleCreatePost(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", postTitle);
    if (postImage) {
      formData.append("image", postImageFile);
    }
    formData.append("content", postContent);

    await axios.post(`${apiUrl}/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    fetchData();
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchData();
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

      <h1>{pageUserInfo?.username}</h1>
      <img src={`${pageUserInfo?.avatarUrl}`} alt="" />
      <p>{pageUserInfo?.bio}</p>
      <p>{pageUserInfo?._count.followedBy} Followers</p>

      {userId !== pageUserId ? (
        <button onClick={handleUpdateFollow}>
          {followStatus ? "Unfollow" : "Follow"}
        </button>
      ) : (
        <form
          onSubmit={handleCreatePost}
          className="space-y-4 border border-gray-300 rounded p-4 my-4 max-w-lg shadow-md"
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

      <h1 className="text-3xl font-bold text-center mb-8">
        {userId === pageUserId ? "Your" : pageUserInfo?.username} Posts (
        {pageUserInfo?._count.posts})
      </h1>

      <div className="space-y-4">
        {pageUserPosts?.map((post) => (
          <PostCard key={post.id} post={post} />
        )) || <p className="text-gray-500">No post yet.</p>}
      </div>
    </div>
  );
}

export default UserPage;
