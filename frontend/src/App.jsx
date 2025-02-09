import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddQuestion from './components/AddQuestion';
import AssignTest from './components/AssignTest';
import StudentDashboard from './components/StudentDashboard';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthContextProvider } from './context/AuthContext';
import Test from './components/Test';

export let role;

function App() {
  

  return (
   <AuthContextProvider>
     <Router>
      <Routes>
        <Route path="/admin/add-question" element={<AddQuestion />} />
        <Route path="/admin/assign-test" element={<AssignTest />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path='/' element={<PrivateRoute />} />
        <Route path='/admindashboard' element={<AdminDashboard />} />
        <Route path="/register/admin" element={<Register role="admin" />} />
        <Route path="/register/student" element={<Register role="student" />} />
        <Route path="/login/admin" element={<Login role="admin" />} />
        <Route path="/login/student" element={<Login role="student" />} />
        <Route path="/test/:testId" element={<Test />} />


      </Routes>
    </Router>
   </AuthContextProvider>
  );
}

export default App;
