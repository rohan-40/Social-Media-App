import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import moment from "moment";

const Comments = ({ comment }) => {
  return (
    <div className="flex items-start gap-2 sm:gap-3 mb-3 pl-2 sm:pl-4">
      
        <div className="h-9 w-9 rounded-full ">
          <Avatar className="h-6 w-6 rounded-full">
            <AvatarImage
              src={comment.author.profilePicture}
              alt="user"
              className="h-full w-full rounded-full object-cover"
            />
            <AvatarFallback className="rounded-full bg-gray-200 text-gray-500 flex items-center justify-center w-full h-full">
               {comment?.author.username?.slice(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
        </div>
      

      <div className="flex flex-col">
        <div className="text-sm">
          <Link
            to={`/profile/${comment.author.username}`}
            className="font-semibold mr-1 "
          >
            {comment.author.username}
          </Link>
          <span className="text-gray-800">{comment.text}</span>
        </div>
        {/* Optional: Timestamp or likes */}
        <div className="text-xs text-gray-400 mt-1">{moment(comment.createdAt).fromNow()} </div>
      </div>
    </div>
  );
};

export default Comments;
