import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import LogoutPopup from './LogoutPopup'; // นำเข้า LogoutPopup
import './App.css'; // นำเข้า CSS ที่คุณรวมไว้

function ProfilePage() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // state สำหรับแสดง popup
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับเปลี่ยนหน้า

   // ฟังก์ชันสำหรับเปิด popup
   const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  // ฟังก์ชันสำหรับยืนยันการออกจากระบบ
  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    navigate('/main'); // เปลี่ยนไปยังหน้า main
  };

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
            <p>ชื่อผู้ใช้</p>
            <Link to="/profile">Profile</Link>
            <Link to="/personal">Personal</Link>
            <Link to="/account">Account</Link>
            <button onClick={handleLogoutClick}>Log out</button> {/* เรียกฟังก์ชันเมื่อกด Log out */}
          </div>
        </aside>
        <main className="profile-main">
          <h2>ประวัติการเข้าใช้งาน</h2>
        </main>
      </div>
      {/* แสดง Popup สำหรับ Logout */}
      {showLogoutPopup && (
        <LogoutPopup 
          onClose={() => setShowLogoutPopup(false)} 
          onConfirm={handleConfirmLogout} // ส่งฟังก์ชันยืนยัน
        />
      )}
    </div>
  );
}

export default ProfilePage;
