import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { toast } from "sonner";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="w-8 h-8 rounded-full overflow-hidden">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];

  const logoutHandler = async () => {
    try {
      const response = await axios.get("http://localhost:4000/user/logout", {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setAuthUser(null));
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = async (textType) => {
    if (textType === "Logout") {
      await logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    }
  };

  return (
    <div className="fixed top-0 z-0 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="mt-8 mb-3 pl-4 font-bold text-xl">Logo</h1>
        <div>
          {sidebarItems.map((item) => (
            <div
              key={item.text} // ✅ use item.text as a unique key
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
