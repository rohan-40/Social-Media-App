import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSuggestedUser } from "@/redux/authSlice";

const getSuggestedUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/user/suggested",{withCredentials:true} );
        
        if (res.data.success) {
          dispatch(setSuggestedUser(res.data.users));
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [dispatch]);
};

export default getSuggestedUser;
