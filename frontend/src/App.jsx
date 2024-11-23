import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "./pages/auth/MainPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import HomePage from "./pages/main/HomePage";
import FollowsPage from "./pages/main/FollowsPage";
import ChatsPage from "./pages/main/ChatsPage";
import ProfilePage from "./pages/main/ProfilePage";

import UserPage from "./pages/sub/UserPage";
import PostPage from "./pages/sub/PostPage";
import ChatPage from "./pages/sub/ChatPage";

import axios from "axios";

export const apiUrl = "http://localhost:8080/api";
export const UserIdContext = createContext(null);

function App() {
  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUserId() {
    try {
      const response = await axios.get(`${apiUrl}/user`, {
        withCredentials: true,
      });
      setUserId(response.data.userId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserId();
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/login"
            element={<LoginPage fetchUserId={fetchUserId} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/follows" element={<FollowsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chat/user/:id" element={<ChatPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </UserIdContext.Provider>
  );
}

export default App;
