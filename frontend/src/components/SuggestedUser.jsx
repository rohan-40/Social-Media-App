import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
  const { suggestedUser } = useSelector((store) => store.auth);
  const [open,setOpen] = useState(false);
  return (
    <div className="my-4 w-full">
      <div className="flex gap-20 mb-2">
        <h1 className="font-medium text-sm text-gray-500">Suggested for you</h1>
        <span onClick={() => setOpen(!open)} className="font-semibold text-sm text-gray-700 cursor-pointer">See All</span>
      </div>
      {open && suggestedUser.map((user) => {
        return (
          <div key={user._id} className="flex items-center justify-between ">
            <div className="flex items-center gap-4 my-4">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  src={user?.profilePicture}
                  alt={user?.username || "User"}
                  className="h-full w-full rounded-full object-cover"
                />
                <AvatarFallback className="rounded-full bg-gray-200 text-gray-500 flex items-center justify-center w-full h-full">
                  {user?.username?.slice(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <Link to={`/profile/${user._id}`} className="font-medium text-gray-900">
                  {user?.username || "Username"}
                </Link>
                
                  <span className="text-sm text-gray-500">
                  {user?.bio || "bio here..."}
                </span>
                
              
              </div>
            </div>
            
            <span className="text-sm text-[#3BADF8] font-semibold cursor-pointer rounded-xl  px-3 py-1 border border-[#3BADF8]">
            Follow
          </span>

          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUser;
