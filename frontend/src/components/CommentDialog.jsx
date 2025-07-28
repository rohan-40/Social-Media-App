import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { X, MoreHorizontal } from "lucide-react";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Comments from "./Comments";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen, post }) => {
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const listRef = useRef(null);

  const sendComment = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:4000/post/${post._id}/comment`,
        { text },
        { withCredentials: true }
      );
      if (res.data.success) {
        const updated = posts.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, res.data.comment] }
            : p
        );
        dispatch(setPosts(updated));
        toast.success(res.data.message);
        setText("");
        setTimeout(() => {
          listRef.current?.scrollTo(0, listRef.current.scrollHeight);
        }, 100);
      }
    } catch {
      toast.error("Failed to post comment");
    }
  };

  const latestPost = posts.find((p) => p._id === post._id);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed inset-0 z-50 mx-auto my-4 max-w-5xl bg-white rounded-md shadow-lg flex overflow-hidden md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-[90vh]">
          
          {/* Left: image panel (desktop only) */}
          <div className="hidden md:block md:w-1/2 bg-black">
            <img
              src={post.image}
              alt="post"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: comment area */}
          <div className="relative flex flex-col w-full md:w-1/2">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                  <AvatarImage
                    src={post.author.profilePicture}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-500 flex items-center justify-center">
                    {post.author.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link
                  to={`/profile/${post.author.username}`}
                  className="font-medium text-sm"
                >
                  {post.author.username}
                </Link>
              </div>

              {/* Only show on desktop */}
              <button className="hidden md:inline-flex p-1 rounded-full hover:bg-gray-100">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Comments */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {latestPost?.comments?.map((c) => (
                <Comments key={c._id} comment={c} />
              ))}
            </div>

            {/* Comment input */}
            <div className="border-t px-4 py-3 bg-white">
              <div className="flex items-center gap-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 rounded-full border px-3 py-2 text-sm focus:outline-none"
                />
                <Button
                  onClick={sendComment}
                  disabled={!text.trim()}
                  variant="ghost"
                  className="text-blue-500 font-semibold"
                >
                  Post
                </Button>
              </div>
            </div>

            {/* Close button for mobile */}
            <Dialog.Close asChild>
              <button className="absolute top-3 right-3 md:hidden p-1 hover:bg-gray-100 rounded-full">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CommentDialog;
