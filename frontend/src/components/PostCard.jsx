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
        <div className="flex items-center">
          <Link to={`/user/${post.author.id}`}>
            {post.author.avatarUrl && (
              <img
                src={post.author.avatarUrl}
                alt={`${post.author.username}'s avatar`}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <p className="font-semibold">{post.author.username}</p>
          </Link>
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
  );
}

export default PostCard;
