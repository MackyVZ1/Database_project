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

// ---------- API สำหรับทำข้อมูล user --------
// เรียกดูข้อมูลผู้ใช้งานทั้งหมด
router.get('/userList', (req, res) => {
    db.query("SELECT * FROM userInfo", (err, results) =>{
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกใช้ข้อมูลผู้ใช้ทั้งหมด"});
        }
        // ส่งข้อมูลกลับเป็น .JSON ; เอา results ไปใช้ต่อเลย
        res.json(results);
    });
});

// เรียกดูข้อมูลผู้ใช้งานด้วยชื่อ
router.get('/userList/:username', (req, res) =>{
    db.query("SELECT * FROM userInfo WHERE username = ?", req.params.username, (err, results) =>{
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกข้อมูลผู้ใช้นี้ได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results)
    })
});

// ลงทะเบียนผู้ใช้งานใหม่
router.post('/register', (req, res) =>{
    const newUser = {
        username: req.body.username, // ชื่อผู้ใช้
        password: req.body.password, // รหัสผ่าน
        email: req.body.email, // อีเมล
    };
    db.query("INSERT INTO userInfo(username, password, email) VALUE (?, ?, ?)", [newUser.username, newUser.password, newUser.email], (err, results) =>{
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถลงทะเบียนได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})
// ลืมรหัสผ่าน
router.get('/forgetpassword', (req, res) =>{
    const userPass = {
        username: req.body.username
    }
    db.query("SELECT password FROM userInfo WHERE username = ?", userPass.username, (err, results) =>{
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถร้องขอรหัสผ่านได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// อัพเดท, แก้ไขข้อมูลผู้ใช้
router.put('/userList/:username/updateProfile', (req, res) => {
    const updateProfile = {
        username: req.body.username,
        email: req.body.email,
        gender: req.body.gender,
        bloodtype: req.body.bloodtype,
        weight: req.body.weight,
        height: req.body.height,
        birthdate: req.body.birthdate
    }
    const columnsUpdate = []; // คอลัมน์ที่จะมีการอัพเดท
    const valuesUpdate = []; // ค่าในการอัพเดท

    // อัพเดท username
    if(updateProfile.username){
        columnsUpdate.push("username = ?");
        valuesUpdate.push(updateProfile.username);
    }
    // อัพเดท email
    if(updateProfile.email){
        columnsUpdate.push("email = ?");
        valuesUpdate.push(updateProfile.email);
    }
    // อัพเดท gender
    if(updateProfile.gender){
        columnsUpdate.push("gender = ?");
        valuesUpdate.push(updateProfile.gender);
    }
    // อัพเดท bloodtype
    if(updateProfile.bloodtype){
        columnsUpdate.push("bloodtype = ?");
        valuesUpdate.push(updateProfile.bloodtype);
    }
    // อัพเดท weight
    if(updateProfile.weight){
        columnsUpdate.push("weight = ?");
        valuesUpdate.push(updateProfile.weight);
    }
    // อัพเดท height
    if(updateProfile.height){
        columnsUpdate.push("height = ?");
        valuesUpdate.push(updateProfile.height);
    }
    // อัพเดท birthdate
    if(updateProfile.birthdate){
        columnsUpdate.push("birthdate = ?");
        valuesUpdate.push(updateProfile.birthdate);
    }

    // ตรวจสอบว่ามีการอัพเดทข้อมูล
    if(columnsUpdate.length > 0){
        valuesUpdate.push(req.params.username)
        db.query(`UPDATE userInfo SET ${columnsUpdate.join(',')} WHERE username = ?`, valuesUpdate, (err, results) =>{
            // ถ้าเกิด error ขึ้น
            if(err){
                res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถอัพเดทข้อมูลได้"});
            }
            // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
            res.json(results);
            })
    }
})

// เปลี่ยนรหัสผ่าน
router.put('/resetpassword', (req, res) =>{
    const newPassword = {
        username: req.body.username,
        newpassword: req.body.newpassword
    }
    db.query("UPDATE userInfo SET password = ? WHERE username = ?", [newPassword.newpassword, newPassword.username], (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถรีเซตรหัสผ่านได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// ---------- API สำหรับเรียกดูข้อมูลจาก dataset --------
// เรียกดูข้อมูลโควิด; ระบุระลอก
router.get('/:covidInfo', (req, res) => {
    db.query(`SELECT * FROM ${req.params.covidInfo}`, (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกดูข้อมูลโควิดระลอกดังกล่าวได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// เรียกดูข้อมูลโควิด; ระบุระลอกและปี
router.get('/:covidInfo/:year', (req, res) => {
    db.query(`SELECT * FROM ${req.params.covidInfo} WHERE year = ${req.params.year}`, (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: `ฐานข้อมูลขัดข้อง, ไม่มีข้อมูล ${req.params.covidInfo} ปี ${req.params.year}`});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// เรียกดูข้อมูลโควิด; ระบุระลอกและปีและอาทิตย์
router.get('/:covidInfo/:year/:weeknum', (req, res) => {
        db.query(`SELECT * FROM ${req.params.covidInfo} WHERE year = ${req.params.year} AND weeknum = ${req.params.weeknum}`, (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: `ฐานข้อมูลขัดข้อง, ไม่มีข้อมูล ${req.params.covidInfo} ปี ${req.params.year} อาทิตย์ที่ ${req.params.weeknum}`});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// เรียกดูข้อมูลโควิดตามพื้นที่
router.get('/:covidProvince', (req, res) => {
        db.query(`SELECT * FROM ${req.params.covidProvince}`, (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกดูข้อมูลโควิดระลอกดังกล่าวได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

module.exports = router;