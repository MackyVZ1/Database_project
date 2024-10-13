import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // นำเข้าไฟล์ CSS ที่รวมทั้งหมดไว้
import MainPage from './MainPage.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import PersonalPage from './PersonalPage.jsx';
import AccountPage from './AccountPage.jsx';
import LogoutPopup from './LogoutPopup.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/personal" element={<PersonalPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/logout" element={<LogoutPopup />} />
      </Routes>
    </Router>
  );
}

export default App;
