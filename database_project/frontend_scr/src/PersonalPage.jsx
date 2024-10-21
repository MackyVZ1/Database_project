import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutPopup from './LogoutPopup';
import './App.css';
import './personal.css';

function PersonalPage() {
  // กำหนด state ต่าง ๆ สำหรับเก็บข้อมูลของผู้ใช้
  const [profileImage, setProfileImage] = useState(null); // เก็บรูปโปรไฟล์
  const [username, setUsername] = useState(''); // เก็บชื่อผู้ใช้ที่แสดงผล
  const [tempUsername, setTempUsername] = useState(''); // เก็บชื่อผู้ใช้ชั่วคราวตอนแก้ไข
  const [email, setEmail] = useState(''); // เก็บอีเมลของผู้ใช้
  const [gender, setGender] = useState(''); // เก็บเพศของผู้ใช้
  const [birthdate, setBirthdate] = useState(''); // เก็บวันเกิดของผู้ใช้
  const [bloodtype, setBloodtype] = useState(''); // เก็บกรุ๊ปเลือด
  const [weight, setWeight] = useState(''); // เก็บน้ำหนัก
  const [height, setHeight] = useState(''); // เก็บส่วนสูง
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // สถานะของ popup logout
  const [showSavePopup, setShowSavePopup] = useState(false); // สถานะของ popup การบันทึกข้อมูล
  const [popupMessage, setPopupMessage] = useState(''); // ข้อความที่จะแสดงใน popup
  const [error, setError] = useState(null); // เก็บข้อความ error หากเกิดข้อผิดพลาด
  const [loading, setLoading] = useState(false); // สถานะการโหลดข้อมูล
  const navigate = useNavigate(); // ใช้สำหรับนำทางไปยังหน้าอื่น

  // URL ของ API ที่ถูกดึงจาก environment variables
  const apiUrl = 'http://localhost:5000/api';

  // ฟังก์ชันสำหรับอัปโหลดรูปโปรไฟล์
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // รับไฟล์รูปจาก input
    if (file) {
      const reader = new FileReader(); // ใช้ FileReader เพื่อแปลงไฟล์เป็น base64
      reader.onload = (event) => {
        setProfileImage(event.target.result); // เซ็ตรูปที่แปลงเป็น base64
      };
      reader.readAsDataURL(file); // เริ่มการอ่านไฟล์
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก backend
  const fetchPersonalData = async () => {
    setLoading(true); // เริ่มแสดงสถานะโหลด

    // ถ้า apiUrl ไม่ถูกกำหนด จะแสดง error
    if (!apiUrl) {
      setError('API URL is not defined');
      setLoading(false);
      return;
    }

    try {
      // เรียก API เพื่อดึงข้อมูลผู้ใช้
      const response = await axios.get(`${apiUrl}/api/user`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ดึงข้อมูลจาก response และเซ็ต state ต่าง ๆ
      const data = response.data;

      const { username, email, gender, birthdate, bloodtype, weight, height, profileImage } = data;
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
      console.error('Error fetching personal data:', error); // แสดง error ใน console
      setError('Error fetching personal data'); // เซ็ตข้อความ error
    } finally {
      setLoading(false); // ปิดสถานะการโหลด
    }
  };

  // ใช้ useEffect เพื่อเรียก fetchPersonalData เมื่อ component ถูก mount
  useEffect(() => {
    fetchPersonalData();
  }, []);

  // ฟังก์ชันสำหรับบันทึกข้อมูลที่แก้ไข
  const handleSubmit = async (event) => {
    event.preventDefault(); // ป้องกันการ reload หน้า
    setLoading(true); // เริ่มแสดงสถานะโหลด

    // ถ้า apiUrl ไม่ถูกกำหนด จะแสดง error
    if (!apiUrl) {
      setError('API URL is not defined');
      setLoading(false);
      return;
    }

    // สร้าง object ข้อมูลผู้ใช้เพื่อส่งไป backend
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

    try {
      // เรียก API เพื่อบันทึกข้อมูลผู้ใช้
      const response = await axios.post(`${apiUrl}/api/user`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ถ้าบันทึกสำเร็จ จะแสดงข้อความ popup
      setPopupMessage('บันทึกข้อมูลเรียบร้อย');
      setShowSavePopup(true);
      setTimeout(() => setShowSavePopup(false), 3000); // ปิด popup หลัง 3 วินาที
    } catch (error) {
      console.error('Error saving personal data:', error); // แสดง error ใน console
      setPopupMessage('บันทึกข้อมูลไม่สำเร็จ'); // แสดงข้อความบันทึกข้อมูลไม่สำเร็จ
      setShowSavePopup(true);
      setTimeout(() => setShowSavePopup(false), 3000); // ปิด popup หลัง 3 วินาที
    } finally {
      setLoading(false); // ปิดสถานะการโหลด
    }
  };

  // ฟังก์ชันสำหรับเปิด popup logout
  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  // ฟังก์ชันสำหรับยืนยันการ logout
  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    navigate('/main'); // นำทางไปที่หน้าหลักหลังจาก logout
  };

  return (
    <div className="personal-page">
      <header className="header">
        {/* ลิงค์กลับไปหน้าหลัก */}
        <Link to="/main" className="YiPPY">
          <h1>YiPPY</h1>
        </Link>
      </header>
      <div className="content">
        <aside className="sidebar">
          <div className="profile-icon">
            {/* แสดงรูปโปรไฟล์ ถ้าไม่มีจะแสดงรูป placeholder */}
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              <img src="https://via.placeholder.com/100" alt="User Icon" />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="profile-sidebar-menu">
            {/* แสดงชื่อผู้ใช้ */}
            <p>{username || 'Username'}</p>
            <Link to="/profile">Profile</Link>
            <Link to="/personal">Personal</Link>
            <Link to="/account">Account</Link>
            <button onClick={handleLogoutClick}>Log out</button>
          </div>
        </aside>
        <main className="main-content">
          <form className="form" onSubmit={handleSubmit}>
            {/* ฟอร์มสำหรับแก้ไขข้อมูลผู้ใช้ */}
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
            <button type="submit" disabled={loading}>บันทึกข้อมูล</button>
          </form>
        </main>
      </div>
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
    </div>
  );
}

export default PersonalPage;
