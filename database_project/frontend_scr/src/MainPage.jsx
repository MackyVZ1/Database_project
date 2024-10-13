import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Import your CSS

function MainPage() {
  const [covidData, setCovidData] = useState([]); // State for storing COVID data
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading indication

  useEffect(() => {
    // Fetch COVID data from the backend
    const fetchCovidData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        // Replace with your actual endpoint
        const response = await fetch('http://your-backend-url/api/covidInfo'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCovidData(data); // Store fetched data in state
      } catch (error) {
        setError(error.message); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCovidData(); // Call the function to fetch data
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="main-container">
      <header className="header">
        <h1 className="logo">YiPPY</h1>
        <div className="profile-dropdown">
          <button className="profile-dropbtn">Profile</button>
          <div className="profile-dropdown-content">
            <Link to="/profile">My Account</Link>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </header>
      <div className="chart-section">
        <img
          src="path/to/your/chart-image.png" // Add your chart image path here
          alt="Chart"
          className="chart-image"
        />
      </div>
      <div className="info-section">
        <p>ข้อมูลเพิ่มเติมเกี่ยวกับเว็บนี้</p>
        <p>รายละเอียดเกี่ยวกับฟีเจอร์ที่น่าสนใจ</p>
      </div>
      <div className="additional-info">
        <p>ข้อมูลเพิ่มเติมที่นี่</p>
      </div>
      <div className="covid-data-section">
        {loading && <p>Loading data...</p>} {/* Show loading message */}
        {error && <p className="error">{error}</p>} {/* Display error if any */}
        <h2>COVID Data</h2>
        {covidData.length > 0 ? (
          <ul>
            {covidData.map((data, index) => (
              <li key={index}>
                {/* Display relevant data properties */}
                <p>Year: {data.year}</p>
                <p>Week: {data.weeknum}</p>
                <p>Province: {data.province}</p>
                {/* Add more fields as needed */}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No data available.</p> // Message when no data is available
        )}
      </div>
    </div>
  );
}

export default MainPage;
