import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, UserIdContext } from "../App";
import axios from "axios";

function LoginPage({ fetchUserId }) {
  const navigate = useNavigate();
  const { userId } = useContext(UserIdContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLocalLogin(event) {
    event.preventDefault();

    try {
      await axios.post(
        `${apiUrl}/login/local`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      await fetchUserId();
      navigate("/home");
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  async function handleGithubLogin() {
    window.location.href = `${apiUrl}/login/github`;
  }

  useEffect(() => {
    if (userId) {
      navigate("/home");
      return;
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Login to your account
          </h1>
          <form onSubmit={handleLocalLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <p className="text-gray-700 text-sm mt-4">
              Don’t have an account yet?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-500 hover:text-blue-700"
              >
                Sign up
              </Link>
            </p>
          </form>
          <button
            type="button"
            onClick={handleGithubLogin}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
