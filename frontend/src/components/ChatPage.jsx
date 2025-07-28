import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MessageCircle } from "lucide-react";
import Messages from "./Messages";
import { setSelectedUser } from "@/redux/authSlice";

const ChatPage = () => {
  const { user, suggestedUser, selectedUser } = useSelector((store) => store.auth);
 
  const dispatch = useDispatch();
  const isOnline = true;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar - Suggested Users */}
      <div className="w-full md:w-[300px] border-r border-gray-300 p-5">
        <h1 className="text-xl font-semibold mb-5 border-b pb-5">
          {user?.username}
        </h1>

        <div className="space-y-4 overflow-y-auto">
          {suggestedUser?.map((u) => (
            <div
              key={u._id}
              className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === u._id ? "bg-gray-200" : ""
              }`}
              onClick={() => dispatch(setSelectedUser(u))}
            >
              <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                <AvatarImage
                  src={u?.profilePicture}
                  className="w-full h-full object-cover"
                  alt={u?.username}
                />
                <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-300 text-xs font-medium rounded-full">
                  {u?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="ml-3">
                <p className="font-medium">{u?.username}</p>
                <span
                  className={`text-xs ${
                    isOnline ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b h-[70px]">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              <AvatarImage
                src={selectedUser?.profilePicture}
                className="w-full h-full object-cover"
                alt={selectedUser?.username}
              />
              <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-300 text-xs font-medium rounded-full">
                {selectedUser?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-semibold text-lg">{selectedUser?.username}</h1>
          </div>

          {/* Chat Messages Placeholder */}
          <Messages/>

          {/* Chat Input */}
          <div className="p-4 border-t flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
          <p>Select someone to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
