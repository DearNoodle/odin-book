import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";

function PostCard({ post }) {
  return (
    <div
      key={post.id}
      className="bg-white shadow rounded-md p-4 flex items-center justify-between"
    >
      <div>
        <Link to={`/user/${post.author.id}`} className="flex items-center">
          {post.author.avatarUrl && (
            <img
              src={post.author.avatarUrl}
              alt={`${post.author.username}'s avatar`}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <p className="font-semibold">{post.author.username}</p>
        </Link>
        <Link to={`/post/${post.id}`}>
          <h3 className="text-lg font-medium">{post.title}</h3>
          <p>{post.content}</p>
        </Link>
        <p className="mt-1">
          {post._count.likedBy} likes {post._count.comments} comments
        </p>
      </div>
      {post.postImageUrl && (
        <img
          src={post.postImageUrl}
          alt={`Post ${post.id}`}
          className="w-24 h-24 rounded-md ml-4 object-cover"
        />
      )}
    </div>
  );
}

export default PostCard;
