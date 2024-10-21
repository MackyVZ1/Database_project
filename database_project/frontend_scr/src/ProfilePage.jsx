import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import LogoutPopup from './LogoutPopup'; // Import LogoutPopup
import axios from 'axios'; // Import axios
import './App.css'; // Import your CSS
import './profile.css';

const apiUrl = 'http://localhost:5000/api'; // Use environment variable

function ProfilePage() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for showing popup
  const [userData, setUserData] = useState({ username: '', loginHistory: [] }); // Default state for userData
  const navigate = useNavigate(); // Use useNavigate for page navigation

  // Function to open popup
  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  // Function to confirm logout
  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    navigate('/main'); // Navigate to main page
  };

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/user/profile`); // Call API for user data
      setUserData({
        username: response.data.username || 'Unknown User',
        loginHistory: Array.isArray(response.data.loginHistory) ? response.data.loginHistory : [], // Ensure loginHistory is an array
      }); // Save user data in state
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({ username: 'Error loading user data', loginHistory: [] }); // Set error state
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="profile-page">
      <header className="header">
        <Link to="/main" className="YiPPY">
          <h1>YiPPY</h1>
        </Link>
      </header>
      <div className="profile-content">
        <aside className="profile-sidebar">
          <div className="profile-icon">
            <img src="https://via.placeholder.com/100" alt="User Icon" />
          </div>
          <div className="profile-sidebar-menu">
            <p>{userData.username || 'Loading...'}</p> {/* Show username or loading message */}
            <Link to="/profile">Profile</Link>
            <Link to="/personal">Personal</Link>
            <Link to="/account">Account</Link>
            <button onClick={handleLogoutClick}>Log out</button> {/* Call function on Log out */}
          </div>
        </aside>
        <main className="profile-main">
          <h2>ประวัติการเข้าใช้งาน</h2>
          {/* Show login history data (example) */}
          {userData.loginHistory && userData.loginHistory.length > 0 ? (
            <ul>
              {userData.loginHistory.map((entry, index) => (
                <li key={index}>{entry}</li> // Display login history
              ))}
            </ul>
          ) : (
            <p>No login history available.</p> // Message when there's no history
          )}
        </main>
      </div>
      {/* Show Logout Popup */}
      {showLogoutPopup && (
        <LogoutPopup 
          onClose={() => setShowLogoutPopup(false)} 
          onConfirm={handleConfirmLogout} // Send confirm function
        />
      )}
    </div>
  );
}

export default ProfilePage;
