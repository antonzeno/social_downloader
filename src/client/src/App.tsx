import React, { useContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navigation from "./components/Navigation";
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import { AuthContext } from './context/AuthContext';

function App() {
  const { userLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={userLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={userLoggedIn ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile"
            element={!userLoggedIn ? <Navigate to="/" /> : <Profile />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;