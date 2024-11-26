import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiUrl, UserIdContext } from "../../App";
import axios from "axios";

function ChatPage() {
  const navigate = useNavigate();
  const { id: chatterId } = useParams();
  const { userId } = useContext(UserIdContext);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatterName, setChatterName] = useState("");
  const messagesEndRef = useRef(null);

  async function fetchData() {
    try {
      const response = await axios.get(
        `${apiUrl}/chat-page/user/${chatterId}`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      setChatterName(data.username);
      setChatMessages(data.chatMessages);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    setMessage("");
    if (message.trim() === "") return;
    try {
      await axios.post(
        `${apiUrl}/message/user/${chatterId}`,
        {
          content: message,
        },
        {
          withCredentials: true,
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchData();

    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [chatterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link
        to="/chats"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md mb-4 inline-block"
      >
        Back
      </Link>

      <h1 className="text-3xl font-bold mb-4">Chat with {chatterName}</h1>

      <div className="flex flex-col h-4/5">
        <div className="bg-white shadow rounded-md p-6 overflow-y-auto h-full flex-grow">
          {chatMessages.length > 0 ? (
            <ul className="space-y-4">
              {chatMessages.map((message) => (
                <li
                  key={message.id}
                  className={
                    message.fromUserId === userId ? "text-right" : "text-left"
                  }
                >
                  <p
                    className={`bg-${
                      message.fromUserId === userId ? "purple" : "blue"
                    }-500 text-white p-2 rounded-lg inline-block max-w-xs`}
                  >
                    {message.content}
                  </p>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>

        <form onSubmit={sendMessage} className="mt-4">
          <div className="flex space-x-8">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-r-md"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
