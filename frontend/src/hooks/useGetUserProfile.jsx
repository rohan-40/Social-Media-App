import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";

const useGetUserProfile = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/user/${id}/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [id]);
};

export default useGetUserProfile;
