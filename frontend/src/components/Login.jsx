import React, { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner"
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const disPatch = useDispatch();

  const [loading,setLoading] = useState(false);

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
      const response = await axios.post("http://localhost:4000/user/login",formData, { withCredentials: true } );
      if (response.data.success) {
        disPatch(setAuthUser(response.data.user)    )
        toast.success(response.data.message);
        navigate("/");
      }
    
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response.data.message)
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#FFFFFF] shadow-md border border-[#E5E7EB] rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-[#1E3A8A] text-center">
          Login
        </h2>

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
            loading?(
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Please Wait...
              </>
            ) : (
              "Login"
            )
          }
        </button>

        {/* Don't have account */}
        <div className="text-center text-sm text-[#64748B]">
          Don't have an account?{" "}
          <span
            className="text-[#1E3A8A] font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
}
