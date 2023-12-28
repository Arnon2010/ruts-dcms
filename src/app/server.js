const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// กำหนดการเชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studycheck'
});

// เชื่อมต่อฐานข้อมูล MySQL
db.connect((err) => {
  if (err) {
    console.log('Unable to connect to MySQL database.', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API สำหรับตรวจสอบข้อมูลเข้าสู่ระบบ
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.log('Error executing MySQL query.', err);
      res.sendStatus(500);
    } else {
      if (result.length > 0) {
        const user = result[0];
        res.status(200).json({ role: user.role });
      } else {
        res.sendStatus(401);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
