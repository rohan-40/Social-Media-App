import * as Dialog from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const navigate = useNavigate();

  const fileHandler = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const dataUrl = await readFileAsDataURL(selectedFile);
      setImagePreview(dataUrl);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);
    if (file) {
      formData.append("image", file);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/post/addPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setPosts([response.data.post, ...posts]));
        toast.success(response.data.message);
        setCaption("");
        setFile("");
        setImagePreview("");
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => setOpen?.(val)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
        <Dialog.Content
          onInteractOutside={() => setOpen(false)}
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     bg-white w-full max-w-md p-6 rounded-2xl shadow-xl 
                     focus:outline-none space-y-5"
        >
          {/* ✅ Accessible Dialog Title and Description */}
          <Dialog.Title className="text-xl font-semibold text-gray-800">
            Create New Post
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500">
            Share a photo with a caption.
          </Dialog.Description>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 rounded-full overflow-hidden">
              <AvatarImage
                src={user.profilePicture}
                alt="User"
                className="w-full h-full object-fit"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{user.username}</p>
              <span className="text-sm text-gray-500">{user.bio}</span>
            </div>
          </div>

          {/* Caption input */}
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full border-none focus-visible:ring-transparent"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="w-full flex items-center justify-center">
              <img
                className="max-h-64 object-contain rounded-md"
                src={imagePreview}
                alt="img_preview"
              />
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileHandler}
          />

          {/* Upload Button */}
          {!imagePreview && (
            <Button
              type="button"
              onClick={() => imageRef.current.click()}
              className="w-full bg-[#0095F6] hover:bg-[#258bcf] text-white font-medium py-2 rounded-lg"
            >
              Select from Computer
            </Button>
          )}

          {/* Submit Button */}
          {imagePreview &&
            (loading ? (
              <Button
                disabled
                className="w-full bg-[#0095F6] hover:bg-[#258bcf] text-white"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button
                onClick={createPostHandler}
                type="submit"
                className="w-full bg-[#0095F6] hover:bg-[#258bcf] text-white cursor-pointer"
              >
                Post
              </Button>
            ))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreatePost;
