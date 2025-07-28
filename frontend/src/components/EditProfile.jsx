import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [bio, setBio] = useState(user.bio || "");
  const [gender, setGender] = useState(user.gender || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("gender", gender);
      if (image) {
        formData.append("profilePicture", image);
      }

      const res = await axios.post(
        `http://localhost:4000/user/profile/edit`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        navigate(`/profile/${res.data.user._id}`);
      }
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error(err?.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4 sm:px-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-8 text-center sm:text-left">
        Edit Profile
      </h1>

      {/* Profile Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 bg-gray-100 px-6 py-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 sm:gap-6">
          <Avatar className="w-20 h-20 rounded-full overflow-hidden">
            <AvatarImage
              src={
                image
                  ? URL.createObjectURL(image)
                  : user.profilePicture || "/default-avatar.png"
              }
              alt={user.username}
              className="w-full h-full object-cover rounded-full"
            />
            <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-200 text-xl font-bold uppercase rounded-full">
              {user.username?.slice(0, 2) || "US"}
            </AvatarFallback>
          </Avatar>

          <div className="text-left">
            <p className="text-lg font-medium">{user.username}</p>
            <p className="text-sm text-gray-600 max-w-xs truncate">
              {user.bio || "No bio yet"}
            </p>
          </div>
        </div>

        {/* Upload input */}
        <div className="flex justify-center sm:block">
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer bg-[#0095F6] text-white px-5 py-2 text-sm rounded-md hover:bg-[#1877f2] text-center font-semibold block"
          >
            Change Photo
          </label>
        </div>
      </div>

      {/* Bio Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Write something about yourself"
          className="w-full border rounded-md px-3 py-2 resize-none"
        />
      </div>

      {/* Gender Dropdown */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border rounded-md px-3 py-2 bg-white text-sm"
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSaveChanges}
          className="bg-[#0095F6] text-white px-6 py-2 rounded-md hover:bg-[#1877f2] text-sm flex items-center gap-2"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin h-4 w-4" />}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
