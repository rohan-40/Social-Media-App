import { Sidebar } from 'lucide-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
    Sidebar
    <div>
        <Outlet/>  {/* Used to render the Children of MainLayout */}
    </div>
    </>
  )
}

export default MainLayout