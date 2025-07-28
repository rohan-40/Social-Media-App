import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import SuggestedUser from "./SuggestedUser";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden lg:block w-full lg:w-[300px] px-5 py-6">
      <div className="flex items-center gap-4 mb-6">
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

        <div className="flex flex-col overflow-hidden">
          <p className="font-medium text-gray-900 truncate">{user?.username || "Username"}</p>
          <span className="text-sm text-gray-500 truncate">{user?.bio || "bio here..."}</span>
        </div>
      </div>

      <SuggestedUser />
    </div>
  );
};

export default RightSidebar;
