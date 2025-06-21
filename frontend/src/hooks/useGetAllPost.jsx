import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/post/all",{withCredentials:true} );
        console.log(res)
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [dispatch]);
};

export default useGetAllPost;
