import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, UserIdContext } from "../../App";
import axios from "axios";
import NavBar from "../../components/NavBar";

function ChatsPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const [recentChattedUsers, setRecentChattedUsers] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get(`${apiUrl}/chats-page`, {
        withCredentials: true,
      });
      setRecentChattedUsers(response.data);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
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

      <p className="text-xl font-semibold mb-4">Recent Chats</p>

      <div className="space-y-4">
        {recentChattedUsers.length > 0 ? (
          recentChattedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow rounded-md p-4 flex items-center justify-between"
            >
              <p className="font-bold text-lg text-gray-800">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </p>
              <Link
                to={`/chat/user/${user.id}`}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2"
              >
                Chat
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No Chats yet.</p>
        )}
      </div>
    </div>
  );
}

export default ChatsPage;
