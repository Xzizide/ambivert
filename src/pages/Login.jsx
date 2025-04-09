import React from "react";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function togglePasswordVisibility() {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/v1/account/token/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: formData.username,
            password: formData.password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ERROR ${response.status}`);
      }
      console.log(response);
    } catch (error) {
      console.error("Failed to log in user:", error);
    }
  }

  return (
    <main className="flex-auto bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold text-pink-600 mb-6">
          Log in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility()}
                className={`absolute inset-y-3 right-1 flex items-center justify-center px-7  hover:text-pink-600 transition-colors ${
                  showPassword
                    ? "h-5 w-5 bg-pink-200 rounded-2xl text-black"
                    : "h-5 w-5 bg-pink-600 rounded-2xl text-white"
                }`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-semibold mt-4"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Don't already have an account?
          <a
            href="/register"
            className="text-pink-600 hover:text-pink-800 ml-2 font-medium"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
