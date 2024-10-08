// import
const express = require('express');
const router = express.Router();
const mysql = require('mysql2')

// Create a connection
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12718944',
    password: '1DYCQpAPGS',
    database: 'sql12718944'
});

// Connect to a database
db.connect((err) =>{
    if(err){
        console.error('Cannot connect to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL')
});

// Create your endpoints/route handlers

// API ; 1 API = 1 route (การทำงาน)
// เรียกดูข้อมูลผู้ใช้งานทั้งหมด
router.get('/userList', (req, res) => {
    db.query("SELECT * FROM userInfo", (err, results) =>{
        res.json(results);
    });
});

// เรียกดูข้อมูลใช้งาน; Profile
router.get('/userList/:username', (req, res) =>{
    db.query("SELECT * FROM userInfo WHERE username = ?", req.params.username, (err, results) =>{
        res.json(results)
    })
});

// สมัครบัญชี
// ส่งข้อมูลด้วย .JSON !!!
router.post('/register', (req, res) =>{
    const newUser = {
        username: req.body.username, // ชื่อผู้ใช้
        password: req.body.password, // รหัสผ่าน
        verifyPassword: req.body.verifyPassword, // ยืนยันรหัสผ่าน
        email: req.body.email, // อีเมล
        verifyInfo: req.body.verifyInfo // ยืนยันข้อมูล
    };
    db.query("INSERT INTO userInfo(username, password, email) VALUE (?, ?, ?)", [newUser.username, newUser.password, newUser.email], (err, results) =>{
        res.json(results);
    })
})

// อัพเดท, แก้ไขข้อมูลผู้ใช้
// ทำอันนี้ต่อตอนกลางวัน
router.put('/userList/:userID/updateProfile', (req, res) => {
    const updateProfile = {
        username: req.body.username,
        email: req.body.email,
        gender: req.body.gender,
        bloodtype: req.body.bloodtype,
        weight: req.body.weight,
        height: req.body.height,
        birthdate: req.body.birthdate
    }
    db.query("UPDATE userInfo SET username = ?, email = ?, gender = ?, bloodtype = ?, weight = ?, height = ?, birthdate = ? WHERE userID = ?", 
        [updateProfile.username, updateProfile.email, updateProfile.gender, updateProfile.bloodtype, updateProfile.weight,
            updateProfile.height, updateProfile.birthdate, req.params.userID], (err, results) => {
                res.json(results);
            })
})
module.exports = router;