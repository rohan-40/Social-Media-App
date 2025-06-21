import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <>
    <LeftSidebar/>
    <div>
        <Outlet/>  {/* Used to render the Children of MainLayout */}
    </div>
    </>
  )
}

export default MainLayout