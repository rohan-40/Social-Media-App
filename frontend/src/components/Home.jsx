import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import getSuggestedUser from '@/hooks/getSuggestedUser'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { useSelector } from 'react-redux'

const Home = () => {
  
  useGetAllPost();
  getSuggestedUser();
  
  return (
    <div className="flex flex-col md:flex-row w-full overflow-x-hidden">
  <div className="flex-grow">
    <Feed />
    <Outlet />
  </div>
  <div className="hidden md:block">
    <RightSidebar />
  </div>
</div>


  )
}

export default Home
