import React, { useState, useEffect } from 'react';
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
import Notification from './components/Notification';
import api from './services/api';

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
  const [notification, setNotification] = useState({
    show: false,
    item: null
  });

  // Function to show notification
  const showNotification = (item) => {
    setNotification({
      show: true,
      item: item
    });
  };

  // Function to hide notification
  const hideNotification = () => {
    setNotification({
      show: false,
      item: null
    });
  };

  // Poll for new items
  useEffect(() => {
    let lastChecked = Date.now();
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.getNewItems(lastChecked);
        if (response.length > 0) {
          // Show notification for the most recent item
          showNotification(response[0]);
          lastChecked = Date.now();
        }
      } catch (error) {
        console.error('Error checking for new items:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(pollInterval);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <main className="container-fluid p-0">
            <Notification
              show={notification.show}
              onClose={hideNotification}
              item={notification.item}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/report" element={
                <ProtectedRoute>
                  <ReportItem onItemReported={showNotification} />
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