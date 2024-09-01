import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import './index.css'
import HomePage from './pages/homepage/HomePage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import ChatPage from './pages/chatPage/ChatPage';
import RootLayout from './layouts/rootLayout/RootLayout';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout';
import SignInPage from './pages/signInPage/SignInPage';
import SignUpPage from './pages/signUpPage/SignUpPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children:[
      {
        path: "/", 
        element: <HomePage/>
      },
      {
        path: "/signIn/*", 
        element: <SignInPage/>
      },
      {
        path: "/signUp/*", 
        element: <SignUpPage/>
      },
      {
        element: <DashboardLayout/>,
        children:[
          {
            path: "/dashboard",
            element: <DashboardPage />
          },
          {
            path: "/dashboard/chats/:id", 
            element:<ChatPage />
          }
        ]
      }
    ]
  },
  {
    
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
