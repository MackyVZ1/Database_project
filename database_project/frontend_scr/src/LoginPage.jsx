import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // นำเข้า CSS ที่คุณรวมไว้

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบถ้วน
    if (!username || !password) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      // ทำการเรียก API เพื่อลงชื่อเข้าใช้
      const response = await fetch('http://your-backend-url/login', { // เปลี่ยนให้เป็น URL ของ backend ของคุณ
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // ส่งข้อมูลเป็น JSON
      });

      const data = await response.json();

      if (response.ok) {
        // การเข้าสู่ระบบสำเร็จ
        alert("เข้าสู่ระบบสำเร็จ!");
        navigate('/main'); // เปลี่ยนไปที่หน้า Main เมื่อเข้าสู่ระบบสำเร็จ
      } else {
        // แสดงข้อความผิดพลาด
        setErrorMessage(data.msg || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); // ใช้ข้อความที่ได้รับจาก backend
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ'); // ข้อความผิดพลาดสำหรับกรณีที่เกิดข้อผิดพลาดในการเรียก API
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
        <button type="submit">ลงชื่อเข้าใช้</button>
      </form>
      <p>ไม่มีบัญชีผู้ใช้? <Link to="/register">คลิกที่นี่เพื่อสมัคร</Link></p>
      <p>โปรดตรวจสอบให้แน่ใจว่าชื่อผู้ใช้และรหัสผ่านถูกต้องก่อนเข้าสู่ระบบ</p> {/* ข้อความแนะนำ */}
    </div>
  );
}

export default LoginPage;
