import React, { useContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navigation from "./components/Navigation";
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import { AuthContext, AuthProvider } from './context/AuthContext';

function App() {
  const { userLoggedIn } = useContext(AuthContext);

  return (
    <AuthProvider>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;