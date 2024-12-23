import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ReportItem from './components/ReportItem';
import SearchItems from './components/SearchItems';
import Login from './components/Login';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import StudentProfile from './components/StudentProfile';
import Admin from './components/Admin';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { rollNo } = useAuth();
  if (!rollNo) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <main className="container-fluid p-0">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/report" element={
                <ProtectedRoute>
                  <ReportItem />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchItems />
                </ProtectedRoute>
              } />
              <Route path="/profile/:rollNo" element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;