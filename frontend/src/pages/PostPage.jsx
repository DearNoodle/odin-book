import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";
import axios from "axios";

function PostPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const { id: postId } = useParams();
  const [postInfo, setPostInfo] = useState();
  const [commentContent, setCommentContent] = useState("");

  async function fetchData() {
    const response = await axios.get(`${apiUrl}/post-page/post/${postId}`, {
      withCredentials: true,
    });
    setPostInfo(response.data);
    console.log(response.data);
  }

  async function handleCreateComment(event) {
    event.preventDefault();
    if (commentContent) {
      await axios.post(
        `${apiUrl}/comment/post/${postId}`,
        { content: commentContent },
        {
          withCredentials: true,
        }
      );
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
    <div className="mx-auto px-4 py-8 min-h-screen max-w-7xl">
      <div className="flex justify-start items-center mb-6">
        <Link
          to="/home"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Back
        </Link>
      </div>

      {postInfo && (
        <>
          <div className="flex">
            {postInfo.author.avatarUrl && (
              <img
                src={postInfo.author.avatarUrl}
                alt="Author Avatar"
                className="w-16 h-16 rounded-full mr-4"
              />
            )}

            <h2 className="text-xl font-bold">{postInfo.author.username}</h2>
          </div>
          <h1 className="text-3xl font-bold mb-2">{postInfo.title}</h1>
          {postInfo.postImageUrl && (
            <img
              src={postInfo.postImageUrl}
              alt="Post Image"
              className="max-w-full mb-4"
            />
          )}
          <p className="text-lg">{postInfo.content}</p>
          <p>Likes: {postInfo._count.likedBy}</p>

          <form className="mb-8" onSubmit={handleCreateComment}>
            <input
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            />
            <button type="submit">Comment</button>
          </form>

          <h1 className="text-3xl font-bold text-center mb-8">
            Comments ({postInfo._count.comments})
          </h1>

          {postInfo.comments.map((comment) => (
            <div key={comment.id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={comment.user.avatarUrl}
                  alt={`${comment.user.username}'s avatar`}
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-medium text-gray-800">
                  {comment.user.username}
                </p>
                <span className="text-gray-500 text-xs">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default PostPage;
