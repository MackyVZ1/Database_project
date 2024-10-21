import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutPopup from './LogoutPopup'; // Import the LogoutPopup component
import './App.css';
import './account.css';

function AccountPage() {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const apiUrl = 'http://localhost:5000/api';

    useEffect(() => {
        if (!apiUrl) {
            setError('API URL is not defined');
        }
    }, [apiUrl]);

    // Function to open logout confirmation popup
    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    // Function to confirm logout
    const handleConfirmLogout = () => {
        setShowLogoutPopup(false);
        navigate('/main'); // Redirect to main page after logout
    };

    // Function to update user profile
    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        const { email, password } = userData;

        try {
            const response = await axios.put(`${apiUrl}/userList/your-username/updateProfile`, {
                email,
                password,
            });

            if (response.status === 200) {
                setPopupMessage('ข้อมูลได้ถูกบันทึกเรียบร้อยแล้ว');
            } else {
                setPopupMessage(response.data.msg || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setPopupMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setShowSavePopup(true);
            setTimeout(() => {
                setShowSavePopup(false);
            }, 3000);
        }
    };

    // Function to handle changes in form input
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

                    {/* Popup แสดงผลลัพธ์การบันทึกข้อมูล */}
                    {showSavePopup && (
                        <div className="popup">
                            <p>{popupMessage}</p>
                        </div>
                    )}
                    {/* Popup ยืนยันการ logout */}
                    {showLogoutPopup && (
                        <LogoutPopup
                            onClose={() => setShowLogoutPopup(false)}
                            onConfirm={handleConfirmLogout}
                        />
                    )}

                    {/* Show error if any */}
                    {error && <p className="error-message">{error}</p>}
                </main>
            </div>
        </div>
    );
}

export default AccountPage; // Export AccountPage
