import React, { useEffect, useState } from 'react'; // นำเข้า React, useEffect, และ useState
import { Link } from 'react-router-dom'; // นำเข้า Link สำหรับการนำทาง
import axios from 'axios'; // นำเข้า axios สำหรับการทำ HTTP requests
import './App.css'; // นำเข้า CSS
import './main.css';

function MainPage() {
  // สร้าง state สำหรับเก็บข้อมูล COVID, ข้อความข้อผิดพลาด, และสถานะกำลังโหลด
  const [covidData, setCovidData] = useState([]); // เก็บข้อมูล COVID
  const [error, setError] = useState(null); // เก็บข้อความข้อผิดพลาด
  const [loading, setLoading] = useState(true); // สถานะกำลังโหลดข้อมูล

  // ฟังก์ชันสำหรับ fetch ข้อมูล COVID จาก API ทีละ endpoint
  const fetchCovidData = async () => {
    setLoading(true); // ตั้งค่า loading เป็น true ขณะดึงข้อมูล

    const apiUrl = import.meta.env.VITE_API_URL; // ใช้ environment variable สำหรับ API URL
    if (!apiUrl) {
      setError('API URL is not defined'); // หากไม่มี API URL จะแสดงข้อผิดพลาด
      setLoading(false); // ตั้งค่า loading เป็น false ถ้าไม่มี API URL
      return;
    }

    // รายชื่อ endpoint ที่จะดึงข้อมูล
    const endpoints = [
      `${apiUrl}/report_round1to2`,
      `${apiUrl}/report_round1to2_province`, 
      `${apiUrl}/report_round3`,
      `${apiUrl}/report_round3_province`,
      `${apiUrl}/report_round4`,
      `${apiUrl}/report_round4_province`,
    ];

    try {
      for (const endpoint of endpoints) {
        const response = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // บันทึกข้อมูล COVID ที่ได้ใน state
        setCovidData(prevData => [...prevData, ...response.data]); // รวมข้อมูลใหม่เข้ากับข้อมูลที่มีอยู่
      }
    } catch (error) {
      console.error('Error fetching COVID data:', error); // แสดงข้อผิดพลาดใน console
      setError('ไม่สามารถดึงข้อมูล COVID ได้'); // ตั้งค่าข้อความข้อผิดพลาด
    } finally {
      setLoading(false); // ตั้งค่า loading เป็น false หลังจาก fetch ข้อมูลเสร็จ
    }
  };

  // ใช้ useEffect เพื่อดึงข้อมูล COVID เมื่อ component โหลดขึ้นครั้งแรก
  useEffect(() => {
    fetchCovidData(); // เรียกใช้งานฟังก์ชัน fetchCovidData เมื่อ component ถูก mount
  }, []); // Empty dependency array หมายความว่า useEffect นี้จะทำงานครั้งเดียวตอน mount

//   // ดึงข้อมูลจากฐานข้อมูล
//   useEffect(() =>{
//     const showUser = async() =>{
//         try{
//             // ยิง API GET method
//             const response = await axios.get("http://localhost:5000/api/report_round1to2")
//             if(response.status === 200){
//                 console.log(response.data)
//                 // นำ json มาเก็บใน data
//                 setData(response.data)
//             }
//         }catch(error){
//             console.log("Error: ", error)
//         }finally{
//             setLoading(false)
//         }
//     }
//     showUser()
// },[]) // [] สำหรับเรนเดอร์ข้อมูลครั้งเดียว ป้องกันการลูป

  return (
    <div className="main-container">
      {/* ส่วนของ Header */}
      <header className="header">
        <h1 className="logo">YiPPY</h1>
        <div className="profile-dropdown">
          <button className="profile-dropbtn">Profile</button>
          <div className="profile-dropdown-content">
            <Link to="/profile">My Account</Link>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </header>

      {/* ส่วนของข้อมูล COVID */}
      <div className="covid-data-section">
        {loading && <p>กำลังโหลดข้อมูล...</p>} {/* แสดงข้อความเมื่อข้อมูลกำลังถูกโหลด */}
        {error && <p className="error">{error}</p>} {/* แสดงข้อความข้อผิดพลาดหากมี */}

        <h2>ข้อมูล COVID</h2>

        {/* แสดงข้อมูล COVID ที่ถูก fetch มา */}
        {covidData.length > 0 ? (
          <ul>
            {covidData.map((data, index) => (
              <li key={index}>
                <p>ปี: {data.year}</p> {/* แสดงปี */}
                <p>อาทิตย์: {data.weeknum}</p> {/* แสดงอาทิตย์ */}
                <p>จังหวัด: {data.province}</p> {/* แสดงจังหวัด */}
                {data.image && (
                  <img
                    src={data.image}
                    alt={`ข้อมูล COVID สำหรับ ${data.province}`}
                    className="covid-image"
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>ไม่มีข้อมูลที่พร้อมใช้งาน</p> // แสดงข้อความหากไม่มีข้อมูลและข้อมูลไม่กำลังโหลด
        )}
      </div>
    </div>
  );
}

export default MainPage; // ส่งออก component MainPage
