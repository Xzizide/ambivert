import React, { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (password) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [password]: !prevState[password],
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const data = JSON.stringify({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
    try {
      const response = await fetch(
        "http://localhost:8000/v1/account/user/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ERROR ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  }

  return (
    <main className="flex-auto bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-center text-3xl font-bold text-pink-600 mb-6">
          Create Your Account
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
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              placeholder="Choose a unique username"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
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
                type={showPassword.password ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 pr-10"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className={`absolute inset-y-3 right-1 flex items-center justify-center px-7  hover:text-pink-600 transition-colors ${
                  showPassword.password
                    ? "h-5 w-5 bg-pink-200 rounded-2xl text-black"
                    : "h-5 w-5 bg-pink-600 rounded-2xl text-white"
                }`}
              >
                {showPassword.password ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 pr-10"
                placeholder="Repeat your password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className={`absolute inset-y-3 right-1 flex items-center justify-center px-7  hover:text-pink-600 transition-colors ${
                  showPassword.confirmPassword
                    ? "h-5 w-5 bg-pink-200 rounded-2xl text-black"
                    : "h-5 w-5 bg-pink-600 rounded-2xl text-white"
                }`}
              >
                {showPassword.confirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-semibold mt-4"
          >
            Register
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?
          <a
            href="/login"
            className="text-pink-600 hover:text-pink-800 ml-2 font-medium"
          >
            Log in
          </a>
        </div>
      </div>
    </main>
  );
}
