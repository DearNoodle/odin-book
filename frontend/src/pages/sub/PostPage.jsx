import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl, UserIdContext } from "../../App";
import axios from "axios";
import "../../../public/css/PostPage.css";

function PostPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const { id: postId } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const [likeStatus, setLikeStatus] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  async function fetchData() {
    try {
      const response = await axios.get(`${apiUrl}/post-page/post/${postId}`, {
        withCredentials: true,
      });
      const data = response.data;
      setPostInfo(data.postInfo);
      setLikeStatus(data.likeStatus);
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  }

  async function handleUpdateLike() {
    try {
      await axios.put(
        `${apiUrl}/like/post/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error updating like:", error);
    }
  }

  async function handleCreateComment(event) {
    event.preventDefault();
    try {
      if (commentContent) {
        await axios.post(
          `${apiUrl}/comment/post/${postId}`,
          { content: commentContent },
          {
            withCredentials: true,
          }
        );
        setCommentContent("");
        fetchData();
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await axios.delete(`${apiUrl}/comment/${commentId}`, {
        withCredentials: true,
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  async function handleDeletePost() {
    try {
      await axios.delete(`${apiUrl}/post/${postId}`, {
        withCredentials: true,
      });
      navigate("/home");
    } catch (error) {
      console.error("Error deleting post:", error);
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
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/home"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Back
        </Link>
        {postInfo && postInfo.author.id === userId && (
          <button
            onClick={handleDeletePost}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Post
          </button>
        )}
      </div>

      {postInfo ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link to={`/user/${postInfo.author.id}`}>
                <img
                  src={postInfo.author.avatarUrl || "/placeholder.jpg"}
                  alt="Author Avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />
              </Link>
              <div>
                <Link to={`/user/${postInfo.author.id}`}>
                  <p className="text-xl font-bold text-gray-800">
                    {postInfo.author.username}
                  </p>
                </Link>
                <span className="text-gray-500 text-sm">
                  {new Date(postInfo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {postInfo.title}
          </h1>
          {postInfo.postImageUrl && (
            <img
              src={postInfo.postImageUrl}
              alt="Post Image"
              className="max-w-full mb-4 rounded-lg shadow-md"
            />
          )}
          <p className="text-lg text-gray-700 mb-4">{postInfo.content}</p>
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleUpdateLike}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                likeStatus ? "liked" : ""
              }`}
            >
              Like ({postInfo._count.likedBy})
            </button>
          </div>
          <form className="mb-8" onSubmit={handleCreateComment}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mt-2"
            >
              Comment
            </button>
          </form>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Comments ({postInfo._count.comments || 0})
          </h2>
          {postInfo.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            postInfo.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white shadow-md rounded-lg p-4 mb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={comment.user.avatarUrl || "/placeholder.jpg"} // Placeholder
                    alt={`${comment.user.username}'s avatar`}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {comment.user.username}
                    </p>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {comment.user.id === userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          )}
        </>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
}

export default PostPage;
