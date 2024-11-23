import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl, UserIdContext } from "../../App";
import NavBar from "../../components/NavBar";
import axios from "axios";

function ProfilePage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserIdContext);
  const [userProfile, setUserProfile] = useState();
  const [imageFile, setImageFile] = useState();
  const [bioInput, setBioInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    const response = await axios.get(`${apiUrl}/profile-page`, {
      withCredentials: true,
    });
    setUserProfile(response.data);
    setIsLoading(false);
  }

  async function handleSubmitImage(e) {
    e.preventDefault();

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        await axios.put(`${apiUrl}/profile/image`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        fetchData();
        console.log("Profile image updated successfully!");
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    }
  }

  async function handleSubmitBio(e) {
    e.preventDefault();

    try {
      await axios.put(
        `${apiUrl}/profile/bio`,
        { bio: bioInput },
        { withCredentials: true }
      );
      fetchData();
      console.log("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
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

      <h1 className="text-3xl font-bold text-center mb-8">Your Profile</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading profile...</p>
      ) : userProfile ? (
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <img
              src={userProfile.avatarUrl}
              alt="Profile"
              className="rounded-full w-48 h-48 object-cover shadow-lg"
            />
          </div>

          <div className="bg-white shadow rounded-md p-6 w-full ">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-bold mb-2"
              >
                Username
              </label>
              <p className="text-gray-900">{userProfile.username}</p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-gray-700 font-bold mb-2"
              >
                Bio
              </label>
              <p className="text-gray-900">
                {userProfile.bio || "No bio yet."}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4 w-full ">
            <form onSubmit={handleSubmitImage} className="mb-4">
              <label
                htmlFor="profileImage"
                className="block text-gray-700 font-bold mb-2"
              >
                Change Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none focus:shadow-outline"
              >
                Update Image
              </button>
            </form>

            <form onSubmit={handleSubmitBio}>
              <label
                htmlFor="bioInput"
                className="block text-gray-700 font-bold mb-2"
              >
                Update Bio
              </label>
              <textarea
                id="bioInput"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none focus:shadow-outline"
              >
                Update Bio
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Unable to load profile. Please try again later.
        </p>
      )}
    </div>
  );
}

export default ProfilePage;
