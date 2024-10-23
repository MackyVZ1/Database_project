import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // นำเข้า axios สำหรับทำ HTTP requests
import './App.css';
import './register.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // สำหรับเก็บข้อความข้อผิดพลาด
  const [successMessage, setSuccessMessage] = useState(''); // สำหรับเก็บข้อความสำเร็จ

  // URL API ที่จะใช้ส่งข้อมูล
  const apiUrl = 'http://localhost:5000/api'; // ใช้ environment variable เช่นเดียวกับหน้า PersonalPage

  // ฟังก์ชันสำหรับการส่งข้อมูลลงทะเบียน
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      setErrorMessage('รหัสผ่านไม่ตรงกัน');
      setSuccessMessage('');
      return;
    }

    // ตรวจสอบว่าผู้ใช้ยืนยันข้อมูลหรือยัง
    if (!isChecked) {
      setErrorMessage('กรุณายืนยันข้อมูลของคุณเป็นความจริง');
      setSuccessMessage('');
      return;
    }

    try {
      // ส่งคำขอลงทะเบียนไปยัง backend ด้วย axios
      const response = await axios.post(`${apiUrl}/api/register`, {
        email,
        username,
        password,
      });

      // ตรวจสอบสถานะของคำขอ
      if (response.status === 201) {
        // ถ้าลงทะเบียนสำเร็จ
        setSuccessMessage('ลงทะเบียนสำเร็จ!'); // แสดงข้อความสำเร็จ
        setErrorMessage(''); // ล้างข้อความข้อผิดพลาด (ถ้ามี)

        // ล้างฟิลด์ข้อมูลหลังจากลงทะเบียน
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setIsChecked(false);
      } else {
        // ถ้าเกิดข้อผิดพลาดจาก backend
        setErrorMessage('เกิดข้อผิดพลาดในการลงทะเบียน');
        setSuccessMessage('');
      }
    } catch (error) {
      // จัดการข้อผิดพลาดจาก backend
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.msg || 'เกิดข้อผิดพลาดในการลงทะเบียน');
        setSuccessMessage('');
      } else {
        setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
        setSuccessMessage('');
      }
    }
  };

  return (
    <div className="register-container">
      <h1>สมัครบัญชีผู้ใช้ใหม่</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="ยืนยันรหัสผ่าน"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Flex container for checkbox and confirmation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            style={{ marginRight: 0, transform: 'scale(1.2)' }} // Set marginRight to 0 to minimize space
          />
          <label style={{ marginRight: '150px' }}>ข้อมูลของข้าพเจ้าเป็นความจริง</label> {/* Remove margin from label */}
        </div>

        <button type="submit">สมัคร</button>
      </form>

      {/* แสดงข้อความข้อผิดพลาด */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* แสดงข้อความสำเร็จ */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <p>มีบัญชีผู้ใช้แล้ว? <Link to="/login">เข้าสู่ระบบ</Link></p>
    </div>
  );
}

export default RegisterPage;
