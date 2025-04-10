import React from "react";
import { useState } from "react";
import accountStorage from "../components/TokenStorage";
import { useNavigate } from "react-router-dom";

export default function ModifyUser() {
  const { token } = accountStorage();
  const clientData = accountStorage((state) => state.clientData);
  const getClientData = accountStorage((state) => state.getClientData);
  const isLoggedIn = !!token;

  const [newUsername, setNewUsername] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/v1/account/user/modify",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: newUsername }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ERROR ${response.status}`);
      } else {
        getClientData();
      }
    } catch (error) {
      console.error("Failed change username:", error);
    }
  }

  return (
    <main className="flex-auto bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold text-pink-600 mb-6">
          Change your username
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="username"
              id="username"
              name="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              placeholder="Enter new username"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-semibold mt-4"
          >
            Change
          </button>
        </form>
      </div>
    </main>
  );
}
