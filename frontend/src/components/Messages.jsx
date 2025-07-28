import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';

const Messages = () => {
  const { selectedUser, user } = useSelector((store) => store.auth);

  // Example messages with sender info
  const fakeMessages = [
    { id: 1, text: "Hey, what's up?", senderId: selectedUser?._id },
    { id: 2, text: "All good! You?", senderId: user?._id },
    { id: 3, text: "Just chilling", senderId: selectedUser?._id },
    { id: 4, text: "Same here 😎", senderId: user?._id },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex flex-col items-center justify-center p-4 ">
        <Avatar className="w-20 h-20 mb-2">
          <AvatarImage
            src={selectedUser?.profilePicture}
            alt={selectedUser?.username}
            className="w-full h-full object-cover rounded-full"
          />
          <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full text-sm font-medium">
            {selectedUser?.username?.slice(0, 2).toUpperCase() || 'NA'}
          </AvatarFallback>
        </Avatar>

        <Link to={`/profile/${selectedUser?._id}`}>
          <Button
            variant="secondary"
            className="border border-gray-300 px-4 py-1 text-sm cursor-pointer"
          >
            View Profile
          </Button>
        </Link>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {fakeMessages.map((msg) => {
          const isMine = msg.senderId === user?._id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-black rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
