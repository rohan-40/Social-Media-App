import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  setAuthUser,
  setSuggestedUser,
  setUserProfile,
} from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts } from "@/redux/postSlice";

const LeftSidebar = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const sidebarItems = [
    { icon: <Home size={20} />, text: "Home" },
    { icon: <Search size={20} />, text: "Search" },
    { icon: <TrendingUp size={20} />, text: "Explore" },
    { icon: <MessageCircle size={20} />, text: "Messages" },
    { icon: <Heart size={20} />, text: "Notifications" },
    { icon: <PlusSquare size={20} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6 rounded-full overflow-hidden">
          <AvatarImage
            src={user?.profilePicture || "/default-avatar.png"}
            alt={user?.username || "User"}
            className="object-cover w-full h-full"
          />
          <AvatarFallback className="bg-gray-200 text-sm font-medium flex items-center justify-center w-full h-full rounded-full">
            {user?.username?.slice(0, 2).toUpperCase() || "US"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },

    { icon: <LogOut size={20} />, text: "Logout" },
  ];

  const logoutHandler = async () => {
    try {
      const response = await axios.get("http://localhost:4000/user/logout", {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setUserProfile(null));
        dispatch(setSuggestedUser([]));
        dispatch(setPosts([]));
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = async (textType) => {
    switch (textType) {
      case "Logout":
        await logoutHandler();
        break;
      case "Create":
        setOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Messages":
        navigate("/chat");
        break;
      default:
        toast(`"${textType}" is not implemented`);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Logo */}
      {!isMobile && (
        <h1 className="mt-8 mb-3 pl-4 font-bold text-xl text-gray-800">Logo</h1>
      )}

      {/* Menu Items */}
      <div className="flex flex-col gap-2 px-4 pt-2">
        {sidebarItems.map((item) => (
          <div
            key={item.text}
            onClick={() => sidebarHandler(item.text)}
            className="flex items-center gap-3 hover:bg-gray-200 cursor-pointer rounded-lg p-3 transition duration-150"
          >
            {item.icon}
            <span className="text-sm font-medium text-gray-700">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Create Post Dialog */}
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
