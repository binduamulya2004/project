const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
    req.user = user;
    next();
  });
};

const upload = multer(); // For handling file uploads

// Endpoint to handle image upload to Cloudinary
app.post('/uploadImage', upload.single('image'), (req, res) => {
  console.log('Uploading image:', req.file); // Log the uploaded file info
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  cloudinary.uploader.upload_stream(
    { folder: 'user_images' }, 
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error); // Log Cloudinary errors
        return res.status(500).json({ message: 'Image upload failed', error });
      }

      // Store the image URL in the database
      const imageUrl = result.secure_url;
      const userId = req.body.userId;
      console.log('Updating user with image URL:', imageUrl); // Log the image URL and user ID
      const query = 'UPDATE users SET image = ? WHERE id = ?';
      db.query(query, [imageUrl, userId], (err) => {
        if (err) {
          console.error('Database update error:', err); // Log database errors
          return res.status(500).json({ message: 'Failed to update user image' });
        }
        res.status(200).json({ message: 'Image uploaded successfully', user: { image: imageUrl } });
      });
    }
  ).end(req.file.buffer);
});


// Register Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const checkuserquery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkuserquery, [email], async (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertquery = 'INSERT INTO users(name, email, password) VALUES(?,?,?)';
      db.query(insertquery, [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).send(err);

        const token = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: '1h' });

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

      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
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


app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, image } = req.body;

  const query = 'UPDATE users SET name = ?, email = ?, image = ? WHERE id = ?';
  db.query(query, [name, email, image, userId], (err, result) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ message: 'Failed to update user' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
});


app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users'; // Replace 'users' with your actual table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Failed to fetch users', error: err });
    }
    res.status(200).json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
