import React, { useState } from "react";
import { User, Mail, Lock, Loader, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { Button } from "./ui/button";

export default function Signup() {
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
      setLoading(true)
      const response = await axios.post(
        "http://localhost:4000/user/register",
        formData
      );
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      }

    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      toast.error(error.response.data.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#FFFFFF] shadow-md border border-[#E5E7EB] rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-[#1E3A8A] text-center">
          Sign Up
        </h2>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Username
          </label>
          <div className="flex items-center border border-[#E5E7EB] rounded-xl px-3 py-2 bg-[#E0F2FE]">
            <User className="text-[#64748B] mr-2" size={18} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              className="w-full bg-transparent focus:outline-none text-[#1E293B] placeholder-[#64748B]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Email
          </label>
          <div className="flex items-center border border-[#E5E7EB] rounded-xl px-3 py-2 bg-[#E0F2FE]">
            <Mail className="text-[#64748B] mr-2" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full bg-transparent focus:outline-none text-[#1E293B] placeholder-[#64748B]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Password
          </label>
          <div className="flex items-center border border-[#E5E7EB] rounded-xl px-3 py-2 bg-[#E0F2FE]">
            <Lock className="text-[#64748B] mr-2" size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full bg-transparent focus:outline-none text-[#1E293B] placeholder-[#64748B]"
            />
          </div>
        </div>

        {/* Submit Button */}


        <button
          type="submit"
          className="w-full bg-[#1E3A8A] hover:bg-[#3B82F6] text-white py-2 rounded-xl font-medium transition duration-200 flex items-center justify-center"
        >
          {
            loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait...
              </>
            ) : (
              'Create Account'
            )
          }
        </button>


        {/* Already have account */}
        <div className="text-center text-sm text-[#64748B]">
          Already have an account?{" "}
          <span className="text-[#1E3A8A] font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
