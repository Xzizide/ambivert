import React from "react";

export default function Home() {
  return (
    <main className=" bg-pink-100 flex flex-col items-center justify-center p-4 flex-auto">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-6 text-pink-600">Ambivert</h1>
        <p className="text-gray-600 mb-8">Connect with strangers instantly!</p>

        <div className="space-y-4">
          <button className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-semibold">
            Start Chatting
          </button>

          <button className="w-full bg-gray-100 text-pink-600 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold">
            How It Works
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Stay safe. Be kind. Have fun!</p>
        </div>
      </div>
    </main>
  );
}
