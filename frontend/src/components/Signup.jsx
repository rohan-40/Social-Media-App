import React, { useState } from "react";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/user/register",
        formData
      );

      if (response.data.success) {
        dispatch(setAuthUser(response.data.user))
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-[#1E3A8A] text-center">Sign Up</h2>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-blue-100">
            <User className="text-gray-500 mr-2" size={18} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-blue-100">
            <Mail className="text-gray-500 mr-2" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-blue-100">
            <Lock className="text-gray-500 mr-2" size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#1E3A8A] hover:bg-[#3B82F6] text-white py-2 rounded-xl font-medium transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Already have account */}
        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="text-[#1E3A8A] font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
