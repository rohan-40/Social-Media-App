import React from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Profile from './components/Profile';
import Home from './components/Home';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';

const browserRouter = createBrowserRouter([
  {
    path:"/",
    element: <MainLayout/>,
    children: [
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/profile/:id",
        element:<Profile/>
      },
      {
        path:"/profile/edit",
        element:<EditProfile/>
      },
      {
        path:"/chat",
        element:<ChatPage/>
      }
    ]
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  
])

const App = () => {
  return (
    <RouterProvider router={browserRouter}/>
  );
};

export default App;
