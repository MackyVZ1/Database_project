import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // นำเข้า axios
import './App.css'; // นำเข้า CSS ที่คุณรวมไว้
import './login.css';

const apiUrl = 'http://localhost:5000/api';  // ใช้ environment variable

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // สร้าง state สำหรับ checkbox
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับการส่งข้อมูลลงทะเบียน
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบถ้วน
    if (!username || !password) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      // ทำการเรียก API เพื่อลงชื่อเข้าใช้
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password, // ส่งข้อมูลเป็น JSON
      });

      // การเข้าสู่ระบบสำเร็จ
      alert("เข้าสู่ระบบสำเร็จ!");
      navigate('/main'); // เปลี่ยนไปที่หน้า Main เมื่อเข้าสู่ระบบสำเร็จ
    } catch (error) {
      // แสดงข้อความผิดพลาด
      if (error.response) {
        // เมื่อได้รับการตอบกลับจาก server
        setErrorMessage(error.response.data.msg || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); // ใช้ข้อความที่ได้รับจาก backend
      } else {
        // ข้อความผิดพลาดสำหรับกรณีที่ไม่สามารถเชื่อมต่อกับ server
        console.error('Error:', error);
        setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ'); // ข้อความผิดพลาดสำหรับกรณีที่เกิดข้อผิดพลาดในการเรียก API
      }
    }
  };

  return (
    <div className="login-container">
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* แสดงข้อความผิดพลาด */}

        {/* Flex container for checkbox and message */}
        <div style={{ display: 'flex', alignItems: 'flex-start', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ marginRight: '8px', transform: 'scale(1.2)', marginTop: '2px' }} // ปรับขนาด checkbox และเลื่อนขึ้นเล็กน้อย
          />
          <label htmlFor="rememberMe" style={{ margin: 0, lineHeight: 'normal' }}>
            โปรดตรวจสอบให้แน่ใจว่าชื่อผู้ใช้และรหัสผ่านถูกต้องก่อนเข้าสู่ระบบ
          </label>
        </div>


        <button type="submit">ลงชื่อเข้าใช้</button>
      </form>
      <p>ไม่มีบัญชีผู้ใช้? <Link to="/register">คลิกที่นี่เพื่อสมัคร</Link></p>
    </div>
  );
}

export default LoginPage;