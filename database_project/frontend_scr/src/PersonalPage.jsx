import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutPopup from './LogoutPopup';
import './App.css';

function PersonalPage() {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [bloodtype, setBloodtype] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false); // state สำหรับ popup แจ้งเตือน
  const [popupMessage, setPopupMessage] = useState(''); // ข้อความใน popup
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับแสดงภาพที่อัปโหลด
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result); // ตั้งค่ารูปภาพเป็น base64
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันดึงข้อมูลจาก backend
  const fetchPersonalData = async () => {
    try {
      const response = await axios.get('/api/user');
      const { username, email, gender, birthdate, bloodtype, weight, height, profileImage } = response.data;

      setUsername(username);
      setTempUsername(username);
      setEmail(email);
      setGender(gender);
      setBirthdate(birthdate);
      setBloodtype(bloodtype);
      setWeight(weight);
      setHeight(height);
      setProfileImage(profileImage);
    } catch (error) {
      console.error('Error fetching personal data:', error);
    }
  };

  useEffect(() => {
    fetchPersonalData();
  }, []);

  // ฟังก์ชันสำหรับบันทึกข้อมูล
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = {
        username: tempUsername,
        email,
        gender,
        birthdate,
        bloodtype,
        weight,
        height,
        profileImage,
      };

      await axios.post('/api/user', userData);

      // แสดง popup ว่าบันทึกข้อมูลเรียบร้อย
      setPopupMessage('บันทึกข้อมูลเรียบร้อย');
      setShowSavePopup(true);

      setTimeout(() => {
        setShowSavePopup(false);
      }, 3000); // popup จะแสดงเป็นเวลา 3 วินาที
    } catch (error) {
      console.error('Error saving personal data:', error);

      // แสดง popup ว่าบันทึกข้อมูลไม่สำเร็จ
      setPopupMessage('บันทึกข้อมูลไม่สำเร็จ');
      setShowSavePopup(true);

      setTimeout(() => {
        setShowSavePopup(false);
      }, 3000); // popup จะแสดงเป็นเวลา 3 วินาที
    }
  };

  // ฟังก์ชันสำหรับเปิด popup logout
  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  // ฟังก์ชันสำหรับยืนยันการออกจากระบบ
  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    navigate('/main');
  };

  return (
    <div className="personal-page">
      <header className="header">
        <Link to="/main" className="YiPPY">
          <h1>YiPPY</h1>
        </Link>
      </header>
      <div className="content">
        <aside className="sidebar">
          <div className="profile-icon">
            {/* แสดงรูปภาพที่ผู้ใช้งานอัปโหลด */}
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <img src="https://via.placeholder.com/100" alt="User Icon" />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="profile-sidebar-menu">
            {username ? ( // แสดงชื่อผู้ใช้เมื่อมีการบันทึก
              <p>{username}</p>
            ) : (
              <p>Username</p> // แสดงข้อความเมื่อยังไม่บันทึก
            )}
            <Link to="/profile">Profile</Link>
            <Link to="/personal">Personal</Link>
            <Link to="/account">Account</Link>
            <button onClick={handleLogoutClick}>Log out</button>
          </div>
        </aside>
        <main className="main-content">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                placeholder="ชื่อผู้ใช้"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Firstname:</label>
              <input type="text" placeholder="ชื่อ" required />
            </div>
            <div className="form-group">
              <label>Lastname:</label>
              <input type="text" placeholder="นามสกุล" required />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div className="form-group">
              <label>Bloodtype:</label>
              <select value={bloodtype} onChange={(e) => setBloodtype(e.target.value)}>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div className="form-group">
              <label>Birthdate:</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Weight:</label>
              <input
                type="number"
                placeholder="น้ำหนัก (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Height:</label>
              <input
                type="number"
                placeholder="ส่วนสูง (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <button type="submit">บันทึกข้อมูล</button>
          </form>
        </main>
      </div>
      {/* แสดง Popup สำหรับบันทึกข้อมูล */}
      {showSavePopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
      {/* แสดง Popup สำหรับ Logout */}
      {showLogoutPopup && (
        <LogoutPopup
          onClose={() => setShowLogoutPopup(false)}
          onConfirm={handleConfirmLogout}
        />
      )}
    </div>
  );
}

export default PersonalPage;
