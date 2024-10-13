import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function AccountPage() {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [showSavePopup, setShowSavePopup] = useState(false); // state for the save popup
    const [popupMessage, setPopupMessage] = useState(''); // message in the popup
    const navigate = useNavigate();

    // Function to open logout popup
    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    // Function to confirm logout
    const handleConfirmLogout = () => {
        setShowLogoutPopup(false);
        navigate('/main'); // Navigate to main page
    };

    // Function to update user profile
    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        
        const { email, password } = userData;

        try {
            const response = await fetch('https://your-backend-url/userList/your-username/updateProfile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setPopupMessage('ข้อมูลได้ถูกบันทึกเรียบร้อยแล้ว');
            } else {
                setPopupMessage(data.msg || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setPopupMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setShowSavePopup(true); // Show the popup after trying to save
            setTimeout(() => {
                setShowSavePopup(false); // Hide the popup after 3 seconds
            }, 3000);
        }
    };

    // Function to handle changes in form inputs
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };

    return (
        <div className="account-page">
            <header className="header">
                <Link to="/main" className="YiPPY">
                    <h1>YiPPY</h1>
                </Link>
            </header>
            <div className="content">
                <aside className="profile-sidebar">
                    <div className="profile-icon">
                        <img src="https://via.placeholder.com/100" alt="User Icon" />
                    </div>
                    <div className="profile-sidebar-menu">
                        <p>ชื่อผู้ใช้</p>
                        <Link to="/profile">Profile</Link>
                        <Link to="/personal">Personal</Link>
                        <Link to="/account">Account</Link>
                        <button onClick={handleLogoutClick}>Log out</button>
                    </div>
                </aside>
                <main className="main-content">
                    <h2>บัญชีผู้ใช้</h2>
                    <form className="account-form" onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>e-mail:</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={userData.email} 
                                onChange={handleChange} 
                                placeholder="กรอก e-mail" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={userData.password} 
                                onChange={handleChange} 
                                placeholder="กรอก Password" 
                                required 
                            />
                        </div>
                        <button type="submit">บันทึกข้อมูล</button>
                    </form>

                    {/* Show Popup for Save Status */}
                    {showSavePopup && (
                        <div className="popup">
                            <p>{popupMessage}</p>
                        </div>
                    )}

                    {/* Show Popup for Logout Confirmation */}
                    {showLogoutPopup && (
                        <div className="logout-popup">
                            <p>คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?</p>
                            <button onClick={handleConfirmLogout}>ยืนยัน</button>
                            <button onClick={() => setShowLogoutPopup(false)}>ยกเลิก</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AccountPage;
