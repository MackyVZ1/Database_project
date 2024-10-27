import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import axios from 'axios'
import { LineChart } from '@mui/x-charts/LineChart';
import "./Registerpage.jsx"
import "./Profile.jsx"
import { useLocation } from "react-router-dom";

const Mainpage = () => {
    // existing state
    const location = useLocation();
    const updatelogUsername = location.state?.updatelogUsername || "";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("loggedInUser"));
    const [signinPopup, setSigninpopup] = useState(false)
    const [yearCovid, setYear] = useState("")
    const yearcovidSelect = ["2020", "2021", "2022"]

    // New state for enhanced features
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterText, setFilterText] = useState('');
    const [drillDownData, setDrillDownData] = useState(null);

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    const [chartData, setChartData] = useState({
        newCases: [],
        totalCases: [],
        newDeaths: [],
        totalDeaths: [],
        weeks: []
    })

    const [userData, setuserData] = useState([])
    const nav = useNavigate()

    // API and data fetching
    const apiURL = "http://localhost:5000/api"

    const fetchCovidData = async (selectedYear) => {
        try {
            let url = `${apiURL}/new_report`;
            const params = new URLSearchParams();
            if (selectedYear) params.append('year', selectedYear);
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url);

            if (response.status === 200) {
                const data = response.data;
                const transformedData = {
                    newCases: data.map(item => item.new_case),
                    totalCases: data.map(item => item.total_case),
                    newDeaths: data.map(item => item.new_death),
                    totalDeaths: data.map(item => item.total_death),
                    weeks: data.map(item => item.weeknum)
                };
                setChartData(transformedData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Drill Down handler
    const handleDataPointClick = (event, weekIndex) => {
        const weekData = {
            week: chartData.weeks[weekIndex],
            newCases: chartData.newCases[weekIndex],
            totalCases: chartData.totalCases[weekIndex],
            newDeaths: chartData.newDeaths[weekIndex],
            totalDeaths: chartData.totalDeaths[weekIndex]
        };
        setSelectedWeek(weekIndex);
        setDrillDownData(weekData);
    };

    // Sorting handlers
    const handleSort = (field) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);

        const sortedData = [...userData].sort((a, b) => {
            if (sortDirection === 'asc') {
                return a[field] > b[field] ? 1 : -1;
            }
            return a[field] < b[field] ? 1 : -1;
        });

        setuserData(sortedData);
    };

    // Filtering handlers
    const handleFilter = (e) => {
        setFilterText(e.target.value);
    };


    // Filter the data
    const filteredUserData = userData.filter(user =>
        user.username.toLowerCase().includes(filterText.toLowerCase()) ||
        user.email.toLowerCase().includes(filterText.toLowerCase())
    );
    // แสดงข้อมูล user เป็นตาราง
    const fetchuserData = async () => {
        try {
            let url = `${apiURL}/userList`
            // ยิง API GET method
            const response = await axios.get(url)
            if (response.status === 200) {
                console.log(response.data)
                // นำ json มาเก็บใน data
                setuserData(response.data)
                console.log(userData)
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    // ------ Handle Event ------
    // Add scroll handler
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;

            // Make the header visible when scrolling up or at the top
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);
    // จัดการ event เมื่อมีการกดปุ่ม เข้าสู่ระบบ
    const handleSigninButtonClick = () => {
        setUsername("");  // เคลียร์ค่าเมื่อเปิด popup
        setPassword("");
        setSigninpopup(true);
    }


    // login
    const handleLoginClick = async () => {
        try {
            let url = `${apiURL}/login`
            const response = await axios.post(url, {  // เปลี่ยนจาก get เป็น post
                username: username,
                password: password
            });

            if (response.status === 200) {  // เพิ่มการเช็คสถานะ
                alert("Login successful");
                setLoggedInUser(username);
                localStorage.setItem("loggedInUser", updatelogUsername);
                setSigninpopup(false);
                setUsername("");  // เคลียร์ค่าหลังจาก login สำเร็จ
                setPassword("");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed");
        }
    }

    const handleLogoutClick = async () => {
        try {
            let url = `${apiURL}/logout`
            const response = await axios.put(url, {
                username: loggedInUser
            });

            if (response.status === 200) {
                setLoggedInUser(null);
                localStorage.removeItem("loggedInUser");
                alert("Logged out successfully");
                fetchuserData();  // อัพเดทรายการ user หลัง logout
            }
        } catch (error) {
            console.error("Error logout:", error);
            alert("Logout failed");
        }
    };
    // Register
    const handleRegisterClick = () => {
        setSigninpopup(false)
        nav('/register')
    }

    // Profile
    const handleProfileClick = () => {
        if (loggedInUser) {  // เช็คว่ามีค่าก่อนส่ง
            console.log(loggedInUser)
            nav('/profile', {
                state: {
                    logUsername: loggedInUser
                }
            });
        }
    };


    useEffect(() => {
        fetchCovidData();
    }, []);  // ตัด useEffect ตัวแรกออกเพราะซ้ำซ้อนกัน

    useEffect(() => {
        fetchCovidData(yearCovid)
    }, [yearCovid])

    // เรียกใช้ User ทั้งหมด
    useEffect(() => {
        fetchuserData();
    }, [loggedInUser]);  // ให้ดึงข้อมูลใหม่เมื่อมีการ login/logout

    // อัพเดทชื่อข้อมูลผู้ใช้เมื่อมีกลับเข้าสู่หน้าหลัก
    useEffect(() => {
        const localUser = localStorage.getItem("loggedInUser");
        if (updatelogUsername) {
            setLoggedInUser(updatelogUsername);
            localStorage.setItem("loggedInUser", updatelogUsername);
        } else if (localUser) {
            setLoggedInUser(localUser);
        }
    }, [updatelogUsername]);

    return (
        <div>
            <div className={`signdiv ${visible ? '' : 'hidden'}`}>
                {loggedInUser ? (
                    <div className="user-menu">
                        <span>{loggedInUser}</span>
                        <div className="dropdown-menu">
                            <button onClick={handleProfileClick}>จัดการบัญชี</button>
                            <button onClick={handleLogoutClick}>ลงชื่อออก</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleSigninButtonClick}>เข้าสู่ระบบ/สมัครสมาชิก</button>
                )}
            </div>
            <div className="topdiv">
                <h1 className="topText1"> YiPPY</h1>
                <h3 className="topText2"> รายงานสถานการณ์โรคโควิด-19</h3>
            </div>
            <h3 className="covidTitle"> ข้อมูลโรคโควิด-19</h3>
            <div className="covid19div1">
                <select
                    value={yearCovid}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">ข้อมูลทั้งหมด</option>
                    {yearcovidSelect.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>

            </div>

            <div className="covid19div2">
                {/* Enhanced user list with sorting and filtering */}
                <div className="userlistdiv">
                    <p>ผู้ใช้ทั้งหมด</p>
                    <input
                        type="text"
                        placeholder="ค้นหาผู้ใช้..."
                        value={filterText}
                        onChange={handleFilter}
                        className="search-input"
                    />
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('username')}>
                                    ชื่อผู้ใช้งาน
                                    {sortField === 'username' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                                <th onClick={() => handleSort('email')}>
                                    อีเมล
                                    {sortField === 'email' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                                <th onClick={() => handleSort('isOnline')}>
                                    สถานะการใช้งาน
                                    {sortField === 'isOnline' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUserData.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isOnline === 1 ? "ใช้งานอยู่" : "ออฟไลน์"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Enhanced charts with drill-down */}
                <div className="covid19line1">
                    <p>จำนวนผู้ป่วยรายใหม่รักษาในโรงพยาบาล</p>
                    <LineChart
                        xAxis={[{ data: chartData.weeks }]}
                        series={[
                            {
                                data: chartData.newCases,
                                label: 'จำนวนผู้ป่วยใหม่',
                                color: '#2196F3'
                            },
                        ]}
                        width={500}
                        height={300}
                        onClick={handleDataPointClick}
                    />
                    <p>รวมทั้งหมด: {chartData.newCases.reduce((sum, value) => sum + value, 0)} คน</p>
                    <p>สะสม: {chartData.totalCases.reduce((sum, value) => sum + value, 0)} คน</p>
                </div>

                {/* Drill-down detail view */}
                {drillDownData && (
                    <div className="drill-down-detail">
                        <h4>รายละเอียดสัปดาห์ที่ {drillDownData.week}</h4>
                        <table>
                            <tbody>
                                <tr>
                                    <td>ผู้ป่วยใหม่:</td>
                                    <td>{drillDownData.newCases} คน</td>
                                </tr>
                                <tr>
                                    <td>ผู้ป่วยสะสม:</td>
                                    <td>{drillDownData.totalCases} คน</td>
                                </tr>
                                <tr>
                                    <td>ผู้เสียชีวิตใหม่:</td>
                                    <td>{drillDownData.newDeaths} คน</td>
                                </tr>
                                <tr>
                                    <td>ผู้เสียชีวิตสะสม:</td>
                                    <td>{drillDownData.totalDeaths} คน</td>
                                </tr>
                            </tbody>
                        </table>
                        <button onClick={() => setDrillDownData(null)}>ปิด</button>
                    </div>
                )}
                <div className="covid19line2">
                    <p>จำนวนผู้เสียชีวิตรายใหม่</p>
                    <LineChart
                        xAxis={[{ data: chartData.weeks }]}
                        series={[
                            {
                                data: chartData.newDeaths,
                                label: 'จำนวนผู้เสียชีวิตใหม่',
                                color: '#F44336'
                            },
                        ]}
                        width={500}
                        height={300}
                    />
                    <p>รวมทั้งหมด: {chartData.newDeaths.reduce((sum, value) => sum + value, 0)} คน</p> {/* แสดงจำนวนรวมของ newDeaths */}
                    <p>สะสม: {chartData.totalDeaths.reduce((sum, value) => sum + value, 0)} คน</p>
                </div>
            </div>

            {signinPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>เข้าสู่ระบบ</h3>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleLoginClick}> ล็อคอิน </button>
                        <button onClick={handleRegisterClick}> สมัครสมาชิก</button>
                        <button onClick={() => setSigninpopup(false)}>Cancel</button>
                    </div>
                </div>
            )}


        </div>
    )
}

export default Mainpage;