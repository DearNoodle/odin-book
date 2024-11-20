import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import FollowsPage from "./pages/FollowsPage";
import ProfilePage from "./pages/ProfilePage";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
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
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </UserIdContext.Provider>
  );
}

export default App;
