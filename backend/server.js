const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT
 
const app = express();
app.use(cors());
app.use(bodyParser.json());
 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newdb',
});
 
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL');
});
 
// Secret key for JWT
const JWT_SECRET = 'hiiiiii';
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the Authorization header
 
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided' });
  }
 
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
 
    req.user = user; // Save user information from token to request object
    next();
  });
};
// Register Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
 
  const checkuserquery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkuserquery, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
 
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
 
    // Hash password before saving to database
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds are set to 10
 
      const insertquery = 'INSERT INTO users(name, email, password) VALUES(?,?,?)';
      db.query(insertquery, [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).send(err);
 
        // Generate JWT token
        const token = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
 
        res.status(200).json({ message: 'User Registered Successfully', token });
      });
    } catch (error) {
      return res.status(500).send('Error hashing password');
    }
  });
});
 
// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
 
  const loginQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(loginQuery, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
 
    if (results.length > 0) {
      const user = results[0];
 
      // Compare password with hashed password
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          // Generate JWT token
          const token = jwt.sign({ email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
 
          res.status(200).json({ message: 'Login Successful', token });
        } else {
          res.status(400).json({ message: 'Invalid Credentials' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error comparing password' });
      }
    } else {
      res.status(400).json({ message: 'Invalid Credentials' });
    }
  });
});
 
 
 
// Protected Route Example - Create Course Endpoint (Requires Authentication)
app.post('/create-course', authenticateToken, (req, res) => {
  const { name, image, startDate, endDate, duration, rating, mentor } = req.body;
 
  const query = 'INSERT INTO courses (name, image, startDate, endDate, duration, rating, mentor) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, image, startDate, endDate, duration, rating, mentor], (err) => {
    if (err) return res.status(500).send(err);
 
    res.status(200).json({ message: 'Course Created Successfully' });
  });
});
 
// Fetch Courses Endpoint (No Authentication Needed)
app.get('/courses', (req, res) => {
  const query = 'SELECT * FROM courses';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
 
    res.status(200).json(results);
  });
});
 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 