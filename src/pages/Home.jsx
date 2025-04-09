import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [roomID, setRoomID] = useState("");
  const [clientID, setClientID] = useState("");
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    setHasContent(roomID.trim() !== "" && clientID.trim() !== "");
  }, [roomID, clientID]);

  const joinChatRoom = (e) => {
    e.preventDefault();

    const url = `http://localhost:5173/chat?room_id=${encodeURIComponent(
      roomID
    )}&client_id=${encodeURIComponent(clientID)}`;

    window.location.href = url;
  };

  return (
    <main className=" bg-pink-100 flex flex-col items-center justify-center p-4 flex-auto">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-6 text-pink-600">Ambivert</h1>
        <p className="text-gray-600 mb-8">Connect with strangers instantly!</p>

        <div className="space-y-4">
          <form onSubmit={joinChatRoom}>
            <label
              htmlFor="roomID"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Room Name
            </label>
            <input
              id="roomID"
              type="text"
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Enter room name"
            />
            <label
              htmlFor="clientID"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nickname
            </label>
            <input
              id="clientID"
              type="text"
              value={clientID}
              onChange={(e) => setClientID(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Enter nickname"
            />
            <button
              type="submit"
              className={`w-full  text-white py-3 rounded-lg  transition-colors duration-300 font-semibold ${
                hasContent
                  ? "bg-pink-500 hover:bg-pink-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!hasContent}
            >
              Start Chatting
            </button>
          </form>
          <Link to="/about">
            <button className="w-full bg-gray-100 text-pink-600 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold">
              How It Works
            </button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Stay safe. Be kind. Have fun!</p>
        </div>
      </div>
    </main>
  );
}
