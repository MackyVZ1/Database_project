// import
const express = require('express');
const router = express.Router();
const mysql = require('mysql2')

// Create a connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'localdatabase',
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
            birthdate date
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
    db.query("SELECT * FROM userDatabase", (err, results) =>{
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกใช้ข้อมูลผู้ใช้ทั้งหมด"});
        }
        // ส่งข้อมูลกลับเป็น .JSON ; เอา results ไปใช้ต่อเลย
        res.json(results);
    });
});

// Example of a login endpoint in your backend
router.put('/login', (req, res) => {
    const user ={
        username: req.body.username,
        password: req.body.password
    }

    db.query("UPDATE userDatabase SET isOnline = TRUE WHERE username = ? AND password = ?", [user.username, user.password], (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถ log in ได้"});
            console.log(err)
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// Example of a login endpoint in your backend
router.put('/logout', (req, res) => {
    const user ={
        username: req.body.username,
        password: req.body.password
    }

    db.query("UPDATE userDatabase SET isOnline = FALSE WHERE username = ? AND password = ?", [user.username, user.password], (err, results) => {
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
    const newUser = {
        username: req.body.username, // ชื่อผู้ใช้
        password: req.body.password, // รหัสผ่าน
        email: req.body.email, // อีเมล
    };
    db.query("INSERT INTO userDatabase(username, password, email) VALUE (?, ?, ?)", [newUser.username, newUser.password, newUser.email], (err, results) =>{
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถลงทะเบียนได้"});
            console.log(err)
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

// โปรไฟล์
router.get('/profile', (req, res) => {
    const username = req.body.username
    db.query("SELECT * FROM userDatabase WHERE username = ?", username, (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถแสดงข้อมูลได้"});
            console.log(err)
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
    // const updateProfile = {
    //     username: req.body.username,
    //     email: req.body.email,
    //     gender: req.body.gender,
    //     bloodtype: req.body.bloodtype,
    //     weight: req.body.weight,
    //     height: req.body.height,
    //     birthdate: req.body.birthdate
    // }
    // const columnsUpdate = []; // คอลัมน์ที่จะมีการอัพเดท
    // const valuesUpdate = []; // ค่าในการอัพเดท

    // // อัพเดท username
    // if(updateProfile.username){
    //     columnsUpdate.push("username = ?");
    //     valuesUpdate.push(updateProfile.username);
    // }
    // // อัพเดท email
    // if(updateProfile.email){
    //     columnsUpdate.push("email = ?");
    //     valuesUpdate.push(updateProfile.email);
    // }
    // // อัพเดท gender
    // if(updateProfile.gender){
    //     columnsUpdate.push("gender = ?");
    //     valuesUpdate.push(updateProfile.gender);
    // }
    // // อัพเดท bloodtype
    // if(updateProfile.bloodtype){
    //     columnsUpdate.push("bloodtype = ?");
    //     valuesUpdate.push(updateProfile.bloodtype);
    // }
    // // อัพเดท weight
    // if(updateProfile.weight){
    //     columnsUpdate.push("weight = ?");
    //     valuesUpdate.push(updateProfile.weight);
    // }
    // // อัพเดท height
    // if(updateProfile.height){
    //     columnsUpdate.push("height = ?");
    //     valuesUpdate.push(updateProfile.height);
    // }
    // // อัพเดท birthdate
    // if(updateProfile.birthdate){
    //     columnsUpdate.push("birthdate = ?");
    //     valuesUpdate.push(updateProfile.birthdate);
    // }

    // // ตรวจสอบว่ามีการอัพเดทข้อมูล
    // if(columnsUpdate.length > 0){
    //     valuesUpdate.push(req.params.username)
    //     db.query(`UPDATE userInfo SET ${columnsUpdate.join(',')} WHERE username = ?`, valuesUpdate, (err, results) =>{
    //         // ถ้าเกิด error ขึ้น
    //         if(err){
    //             res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถอัพเดทข้อมูลได้"});
    //         }
    //         // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
    //         res.json(results);
    //         })
    // }
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
// เรียกดูข้อมูลโควิดระลอก 1 ถึง 2
router.get('/report_round1to2', (req, res) => {
    db.query("SELECT * FROM report_round1to2", (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกดูข้อมูลโควิดระลอก 1 ถึง 2 ได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// เรียกดูข้อมูลโควิดระลอก 1 ถึง 2 ตามจังหวัด
router.get('/report_round1to2_by_province', (req, res) => {
    db.query("SELECT * FROM report_round1to2_by_province", (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกดูข้อมูลโควิดระลอก 1 ถึง 2 ตามจังหวัดได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// เรียกดูข้อมูลโควิดระลอก 3
router.get('/report_round3', (req, res) => {
        db.query("SELECT * FROM report_round3", (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกดูข้อมูลโควิดระลอก 3 ได้"});
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})
// เรียกดูข้อมูลโควิดระลอก 3 ตามจังหวัด
router.get('/report_round3_by_province', (req, res) => {
    db.query("SELECT * FROM report_round3_by_province", (err, results) => {
    // ถ้าเกิด error ขึ้น
    if(err){
        res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกดูข้อมูลโควิดระลอก 3 ตามจังหวัดได้"});
    }
    // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
    res.json(results);
})
})

// เรียกดูข้อมูลโควิดระลอก 4
router.get('/report_round4', (req, res) => {
        db.query("SELECT * FROM report_round4", (err, results) => {
        // ถ้าเกิด error ขึ้น
        if(err){
            res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกดูข้อมูลโควิดระลอก 4 ได้"});;
        }
        // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
        res.json(results);
    })
})

// เรียกดูข้อมูลโควิดระลอก 4 ตามจังหวัด
router.get('/report_round4_by_province', (req, res) => {
    db.query("SELECT * FROM report_round4_by_province", (err, results) => {
    // ถ้าเกิด error ขึ้น
    if(err){
        res.status(400).json({msg: "ฐานข้อมูลขัดข้อง, ไม่สามารถเรียกดูข้อมูลโควิดระลอก 4 ตามจังหวัดได้"});;
    }
    // ส่งข้อมูลกลับเป็น .json ; เอา results ไปใช้ต่อเลย
    res.json(results);
})
})

module.exports = router;