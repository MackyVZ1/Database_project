// import extension
const express = require('express'); // ExpressJS
const cors = require('cors')
const { createServer } = require('@vercel/node'); // ใช้ฟังก์ชันนี้ในการสร้าง serverless function


// Variable Declaration
const port = process.env.port || 5000; // เช็คว่าถ้าหา port ไม่เจอ ให้ใช้ 5000

// Init express
const app = express();

app.use(cors({
    orgin:'*',
    methods:["GET", "POST", "PUT"]
}))

// กำหนด middleware ,รับข้อมูลแบบ JSON; Body parse
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// กำหนด route ที่จะใช้ 
app.use('/api', require('./routes/api/api.js'));

// // Listen on a port
// app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = createServer(app);