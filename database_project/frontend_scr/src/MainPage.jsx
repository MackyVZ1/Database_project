import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import axios from 'axios'; 
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css'; 
import './main.css';

// Register chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function MainPage() {
  const [covidData, setCovidData] = useState({
    round1to2: [],
    round1to2Province: [],
    round3: [],
    round3Province: [],
    round4: [],
    round4Province: []
  });
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [selectedData, setSelectedData] = useState(null); // เก็บข้อมูลที่กดจากกราฟ
  const [profileImage, setProfileImage] = useState(null);

  // ฟังก์ชันสำหรับ fetch ข้อมูลทีละ request
  const fetchCovidData = async () => {
    setLoading(true); 
    const apiUrl = 'http://localhost:5000/api'; 

    // Fetch แยกแต่ละรอบ
    const fetchRound1to2 = async () => {
      const response = await axios.get(`${apiUrl}/report_round1to2`);
      return response.data;
    }

    const fetchRound1to2Province = async () => {
      const response = await axios.get(`${apiUrl}/report_round1to2_province`);
      return response.data;
    };

    const fetchRound3 = async () => {
      const response = await axios.get(`${apiUrl}/report_round3`);
      return response.data;
    };

    const fetchRound3Province = async () => {
      const response = await axios.get(`${apiUrl}/report_round3_province`);
      return response.data;
    };

    const fetchRound4 = async () => {
      const response = await axios.get(`${apiUrl}/report_round4`);
      return response.data;
    };

    const fetchRound4Province = async () => {
      const response = await axios.get(`${apiUrl}/report_round4_province`);
      return response.data;
    };

    try {
      // ดึงข้อมูลทั้งหมด
      const round1to2Data = await fetchRound1to2();
      const round1to2ProvinceData = await fetchRound1to2Province();
      const round3Data = await fetchRound3();
      const round3ProvinceData = await fetchRound3Province();
      const round4Data = await fetchRound4();
      const round4ProvinceData = await fetchRound4Province();

      setCovidData({
        round1to2: round1to2Data,
        round1to2Province: round1to2ProvinceData,
        round3: round3Data,
        round3Province: round3ProvinceData,
        round4: round4Data,
        round4Province: round4ProvinceData,
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching COVID data:', error);
      setError('ไม่สามารถดึงข้อมูล COVID ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCovidData();
  }, []);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลรูปภาพโปรไฟล์จาก backend
    const fetchProfileImage = async () => {
      try {
        // ดึงข้อมูลรูปภาพจาก backend โดยใช้ axios
        const response = await axios.get(`${apiUrl}/user/profileImage`); // เรียก API ที่ดึงรูปโปรไฟล์
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage); // ใช้รูปจาก response ถ้ามี
        } else {
          const uploadedImage = localStorage.getItem('profileImage'); // fallback ไปที่ localStorage
          setProfileImage(uploadedImage || null); // ใช้รูป local หรือ null ถ้าไม่มี
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
        const uploadedImage = localStorage.getItem('profileImage'); // fallback ไปที่ localStorage เมื่อเกิดข้อผิดพลาด
        setProfileImage(uploadedImage || null); // ใช้รูป local หรือ null ถ้าไม่มี
      }
    };

    fetchProfileImage(); // เรียกฟังก์ชันเมื่อคอมโพเนนต์โหลด
  }, []);

  // ฟังก์ชันเตรียมข้อมูลกราฟ
  const prepareChartData = (roundData) => {
    const weeks = roundData.map(data => `Week ${data.weeknum}`);
    const newCases = roundData.map(data => data.new_cases);
    const cumulativeCases = roundData.map(data => data.cumulative_cases);

    return {
      labels: weeks,
      datasets: [
        {
          label: 'จำนวนผู้ป่วยรายใหม่',
          data: newCases,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
        {
          label: 'จำนวนผู้ป่วยสะสม',
          data: cumulativeCases,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
        },
      ],
    };
  };

  // กำหนด options ของกราฟ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'ข้อมูลผู้ป่วย COVID-19 รายใหม่และสะสมในแต่ละสัปดาห์',
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const { index } = elements[0].element;
        const dataPoint = covidData.round1to2[index]; // เปลี่ยนตรงนี้ตามข้อมูลที่ใช้
        setSelectedData(dataPoint); // แสดงข้อมูลเชิงลึก
      }
    },
  };

  return (
    <div className="main-container">
      <header className="header">
        <h1 className="logo">YiPPY</h1>
        <div className="profile-dropdown">
          <button className="profile-dropbtn">
            {/* ถ้ามีรูปโปรไฟล์จะแสดงรูป ถ้าไม่มีก็แสดง placeholder */}
            <img 
              src={profileImage || "/images/placeholder-profile.png"} 
              alt="Profile" 
              className="profile-image" 
            />
          </button>
          <div className="profile-dropdown-content">
            <Link to="/profile">My Account</Link>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </header>

      <div className="covid-data-section">
        {loading && <p>กำลังโหลดข้อมูล...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <h2>ข้อมูล COVID</h2>

            {/* แสดงกราฟ 3 กราฟ */}
            <h3>กราฟแสดงจำนวนผู้ป่วยรายใหม่ในแต่ละสัปดาห์ของแต่ละระลอก</h3>
            <Line data={prepareChartData(covidData.round1to2)} options={chartOptions} />

            <h3>กราฟแสดงจำนวนผู้ป่วยสะสมในแต่ละปี</h3>
            <Line data={prepareChartData(covidData.round3)} options={chartOptions} />

            <h3>กราฟแสดงจำนวนผู้ป่วยรายใหม่และสะสมในรอบ 4</h3>
            <Line data={prepareChartData(covidData.round4)} options={chartOptions} />

            {/* Modal แสดงข้อมูลเชิงลึกเมื่อคลิกที่กราฟ */}
            {selectedData && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setSelectedData(null)}>&times;</span>
                  <h3>ข้อมูลเพิ่มเติม</h3>
                  <p><strong>ปี:</strong> {selectedData.year}</p>
                  <p><strong>สัปดาห์:</strong> {selectedData.weeknum}</p>
                  <p><strong>จำนวนผู้ป่วยรายใหม่:</strong> {selectedData.new_cases}</p>
                  <p><strong>จำนวนผู้ป่วยสะสม:</strong> {selectedData.cumulative_cases}</p>
                  <p><strong>จังหวัด:</strong> {selectedData.province}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MainPage;
