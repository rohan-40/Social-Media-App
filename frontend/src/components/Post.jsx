// ✅ Improved Post.jsx: Removed sidebar width styles, fixed avatar circle containment, enhanced layout

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setPosts } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const posts = useSelector((store) => store.post);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Islikes, setLikes] = useState(() => post.likes.includes(user._id));

  const changeEventHandler = (e) => setText(e.target.value.trim() ? e.target.value : "");

  const likeHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:4000/post/${post._id}/likes`, {}, { withCredentials: true });
      if (res.data.success) {
        const updatedPosts = posts.posts.map((p) => p._id === post._id ? { ...p, likes: res.data.updatedLikes } : p);
        dispatch(setPosts(updatedPosts));
        setLikes(res.data.updatedLikes.includes(user._id));
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:4000/post/${post._id}/comment`, { text }, { withCredentials: true });
      if (res.data.success) {
        const updatedPost = posts.posts.map((p) => p._id === post._id ? { ...p, comments: [...p.comments, res.data.comment] } : p);
        dispatch(setPosts(updatedPost));
        setText("");
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to comment.");
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/post/delete/${post._id}`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setPosts(posts.posts.filter((p) => p._id !== post._id)));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage
              src={post?.author.profilePicture}
              alt="user"
              className="h-full w-full object-cover rounded-full"
            />
            <AvatarFallback className="bg-gray-200 text-gray-500 flex items-center justify-center w-full h-full rounded-full">
              {post?.author.username?.slice(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
          <h1 className="font-semibold text-sm">{post?.author?.username || "Unknown"}</h1>
        </div>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
            <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-80 rounded-xl overflow-hidden shadow-xl">
              <div className="text-center text-sm font-medium divide-y divide-gray-300">
                {user._id !== post?.author._id && (
                  <button className="text-red-500 py-3 w-full hover:bg-gray-100 cursor-pointer">Unfollow</button>
                )}
                <button className="py-3 w-full hover:bg-gray-100 cursor-pointer">Add to favorites</button>
                {user._id === post?.author._id && (
                  <Dialog.Close asChild>
                    <button onClick={deleteHandler} className="text-red-500 py-3 w-full hover:bg-gray-100 cursor-pointer">Delete</button>
                  </Dialog.Close>
                )}
                <Dialog.Close asChild>
                  <button className="py-3 w-full hover:bg-gray-100 cursor-pointer">Cancel</button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Image */}
      <img
        className="rounded-md mb-3 w-full object-contain max-h-[500px]"
        src={post?.image}
        alt="post"
      />

      {/* Icons */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          {Islikes ? (
            <FaHeart size={22} color="red" className="cursor-pointer" onClick={likeHandler} />
          ) : (
            <FaRegHeart size={22} className="cursor-pointer hover:text-gray-600" onClick={likeHandler} />
          )}
          <MessageCircle onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      {/* Likes & Caption */}
      <span className="font-medium block mb-1">{post?.likes.length} likes</span>
      <p className="text-sm mb-2">
        <span className="font-medium mr-2">{post?.author.username}</span>
        {post.caption}
      </p>

      {/* View Comments */}
      <span onClick={() => setOpen(true)} className="cursor-pointer text-sm text-gray-500 mb-3 block">
        View all {post?.comments?.length || 0} comments
      </span>

      {/* Dialog */}
      <CommentDialog open={open} setOpen={setOpen} post={post} />

      {/* Comment Input */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        {text && (
          <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer font-medium text-sm">
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
