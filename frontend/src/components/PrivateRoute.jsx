import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  const role = localStorage.getItem('role'); // Get role from localStorage

  if (!token) {
    return <Navigate to="/login/student" />; // Redirect to login if no token
  }

  // Redirect based on role
  if (role === 'student') {
    return <Navigate to="/studentdashboard" />;
  } else if (role === 'admin') {
    return <Navigate to="/admindashboard" />;
  }
  else {
    return <Navigate to="/studentdashboard" />;
  }

  return children; // If no role issues, render children
};

export default PrivateRoute;
