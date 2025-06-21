import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        {/* Avatar and Username */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 rounded-full overflow-hidden">
            <AvatarImage src={post.author.profilePicture} alt="post_image" className="w-full h-full object-cover" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author.username}</h1>
        </div>

        {/* Instagram-style dialog */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              aria-label="Open post options"
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal className="cursor-pointer" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
            <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-80 rounded-xl overflow-hidden shadow-xl">
              <div className="text-center text-sm font-medium divide-y divide-gray-300">
                <button className="text-red-500 py-3 w-full hover:bg-gray-100 cursor-pointer">
                  Unfollow
                </button>
                <button className="py-3 w-full hover:bg-gray-100 cursor-pointer">
                  Add to favorites
                </button>
                <Dialog.Close asChild>
                  <button className="py-3 w-full hover:bg-gray-100 cursor-pointer">
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <img
        className="rounded-sm my-2 w-full object-contain"
        src={post.image}
        alt="post"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <MessageCircle
            onClick={() => {
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-1">{post.likes.length} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      <span
        onClick={() => {
          setOpen(true);
        }}
        className="cursor-pointer text-sm text-gray-400"
      >
        View of 10 Comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#3BADF8]">Post</span>}
      </div>
    </div>
  );
};

export default Post;
