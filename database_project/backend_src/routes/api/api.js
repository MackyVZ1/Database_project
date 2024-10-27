// import
const express = require('express');
const router = express.Router();
const mysql = require('mysql2')

// Create a connection
const db = mysql.createConnection({
    host: 'becct8wm9kkmgla1znpc-mysql.services.clever-cloud.com', // becct8wm9kkmgla1znpc-mysql.services.clever-cloud.com
    user: 'uni7obbbmtobdmpz',   // uni7obbbmtobdmpz
    password:'s9zqbpH6eCR3BU4Ww1gD', // s9zqbpH6eCR3BU4Ww1gD
    database: 'becct8wm9kkmgla1znpc', // becct8wm9kkmgla1znpc
    port: 3306,
    waitForConnections: true,
    connectionLimit: 20
});

// Connect to a database
db.connect((err) =>{
    if(err){
        console.error('Cannot connect to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL')
    const createQuery = `
        CREATE TABLE IF NOT EXISTS userDatabase(
            username VARCHAR(45) PRIMARY KEY NOT NULL,
            password VARCHAR(45) NOT NULL,
            email VARCHAR(60) NOT NULL,
            gender VARCHAR(10),
            bloodtype VARCHAR(5),
            weight float,
            height float,
            birthdate date,
            isOnline boolean DEFAULT FALSE
        );
    `
    db.query(createQuery, (err, results) => {
        if(err){
            console.log(err);
        }
        console.log("userDatabase is created.")
    })
});

// Create your endpoints/route handlers

// ---------- API สำหรับทำข้อมูล user --------
// เรียกดูข้อมูลผู้ใช้งานทั้งหมด
router.get('/userList', (req, res) => {
    db.query("SELECT username, email, isOnline FROM userDatabase ORDER BY isOnline DESC", (err, results) =>{
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกใช้ข้อมูลผู้ใช้ทั้งหมด"});
            console.log(err)
        }
        // ส่งข้อมูลกลับเป็น .JSON ; เอา results ไปใช้ต่อเลย
        res.json(results);
    });
});

// Example of a login endpoint in your backend
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบ username และ password ในฐานข้อมูล
    db.query("SELECT * FROM userDatabase WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err) {
            return res.status(400).json({ msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถ log in ได้" });
        }

        if (results.length > 0) {
            // ถ้าพบ username และ password ที่ตรงกัน
            db.query("UPDATE userDatabase SET isOnline = TRUE WHERE username = ?", [username], (err) => {
                if (err) {
                    return res.status(500).json({ msg: "ไม่สามารถอัปเดตสถานะการออนไลน์ได้" });
                }
                res.status(200).json({ msg: "Login successful", user: username });
            });
        } else {
            // ถ้าไม่พบ username หรือ password ไม่ถูกต้อง
            res.status(401).json({ msg: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
    });
});

// Example of a login endpoint in your backend
router.put('/logout', (req, res) => {
    const {username} = req.body

    db.query("UPDATE userDatabase SET isOnline = FALSE WHERE username = ? ", [username], (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถ log out ได้"});
            console.log(err)
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// ลงทะเบียนผู้ใช้งานใหม่
router.post('/register', (req, res) =>{
    const {newUsername, newPassword, newEmail} = req.body
    db.query("INSERT INTO userDatabase(username, password, email) VALUE (?, ?, ?)", [newUsername, newPassword, newEmail], (err, results) =>{
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถลงทะเบียนได้"});
            console.log(err)
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// โปรไฟล์
router.get('/profile', (req, res) => {
    const { username } = req.query;
    db.query("SELECT * FROM userDatabase WHERE username = ?", [username], (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถแสดงข้อมูลได้"});
            console.log(err)
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// อัพเดทข้อมูล
router.put("/updateprofile", (req, res) => {
    const {username, password, email, gender, bloodtype, weight, height, birthdate, oldusername} = req.body
    const query = "UPDATE userDatabase SET username = ?, password = ?, email = ?, gender = ?, bloodtype = ?, weight = ?, height = ?, birthdate = ? WHERE username = ?"
    const value = [username, password, email, gender, bloodtype, weight, height, birthdate, oldusername]
    db.query(query, value, (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถแสดงข้อมูลได้"});
            console.log(err)
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})



// ---------- API สำหรับเรียกดูข้อมูลจาก dataset --------
// เรียกดูข้อมูลโควิดระลอก 1 ถึง 2
router.get('/new_report', (req, res) => {
    const { year } = req.query;
    let query = "SELECT year, weeknum, new_case, total_case, new_death, total_death FROM new_report";
    
    // ตรวจสอบว่าได้รับ query parameters year และ weeknum หรือไม่
    if (year) {
        query += " WHERE";
        const conditions = [];
        if (year) conditions.push(` year = ${db.escape(year)} `);
        
        query += conditions.join(" AND ");
    }

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ msg: "ไม่สามารถเรียกดูข้อมูลได้" });
        }
        res.json(results);
    });
});


module.exports = router;