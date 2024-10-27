import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const location = useLocation();
    const logUsername = location.state?.logUsername || "";
    const nav = useNavigate();
    const apiUrl = 'http://localhost:5000/api';

    const [userData, setUserData] = useState({
        username: "",
        password: "",
        email: "",
        gender: "โปรดระบุ",
        bloodtype: "โปรดระบุ",
        weight: "โปรดระบุ",
        height: "โปรดระบุ",
        birthdate: ""
    });

    const [loading, setLoading] = useState(false);

    const handleLogoutClick = async () => {
        try {
            let url = `${apiUrl}/logout`
            const response = await axios.put(url, {
                username: userData.username
            });

            if (response.status === 200) {
                alert("Logged out successfully");
            }
        } catch (error) {
            console.error("Error logout:", error);
            alert("Logout failed");
        }
        nav('/',{state:{updatelogusername:userData.username}})
    };

    const handleUpdateClick = async (e) => {
        e.preventDefault(); // ป้องกันการ submit form แบบปกติ
        try {
            setLoading(true);
            const response = await axios.put(`${apiUrl}/updateprofile`, {
                ...userData,
                oldusername: logUsername
            });
            alert('บันทึกข้อมูลสำเร็จ');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/profile`, {
                params: { username: logUsername }
            });

            if (response.status === 200) {
                const birthdate = response.data[0].birthdate 
                    ? new Date(response.data[0].birthdate).toISOString().split('T')[0]
                    : '';

                setUserData({
                    username: response.data[0].username || "",
                    password: response.data[0].password || "",
                    email: response.data[0].email || "",
                    gender: response.data[0].gender || "โปรดระบุ",
                    bloodtype: response.data[0].bloodtype || "โปรดระบุ",
                    weight: response.data[0].weight || "โปรดระบุ",
                    height: response.data[0].height || "โปรดระบุ",
                    birthdate: birthdate || ""
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (logUsername) {
            fetchUserData();
        }
    }, [logUsername]);

    return (
        <div className="profile-page">
            <header className="header">
                <h1>YiPPY</h1>
            </header>
            <div className="profile-content">
                <aside className="profile-sidebar">
                    <div className="profile-icon">
                        <img src="https://www.thaimediafund.or.th/wp-content/uploads/2024/07/default-avatar-profile-icon-.jpg" alt="User Icon" />
                    </div>
                    <div className="profile-sidebar-menu">
                        <p>Profile</p>
                        <button onClick={handleLogoutClick}>กลับสู่หน้าหลัก</button>
                    </div>
                </aside>
                <main className="profile-main">
                    <form className="profileform" onSubmit={handleUpdateClick}>
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="ชื่อผู้ใช้"
                                value={userData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="text"
                                name="password"
                                placeholder="รหัสผ่าน"
                                value={userData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="อีเมล"
                                value={userData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>เพศ:</label>
                            <select 
                                name="gender"
                                value={userData.gender} 
                                onChange={handleInputChange}
                            >
                                <option value="โปรดระบุ">โปรดระบุ</option>
                                <option value="ชาย">ชาย</option>
                                <option value="หญิง">หญิง</option>
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>กรุ๊ปเลือด:</label>
                            <select 
                                name="bloodtype"
                                value={userData.bloodtype} 
                                onChange={handleInputChange}
                            >
                                <option value="โปรดระบุ">โปรดระบุ</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>น้ำหนัก:</label>
                            <input
                                type="number"
                                name="weight"
                                placeholder="น้ำหนัก (kg)"
                                value={userData.weight}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>ส่วนสูง:</label>
                            <input
                                type="number"
                                name="height"
                                placeholder="ส่วนสูง (cm)"
                                value={userData.height}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>วัน/เดือน/ปีเกิด:</label>
                            <input
                                type="date"
                                name="birthdate"
                                value={userData.birthdate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default Profile;