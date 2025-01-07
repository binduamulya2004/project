const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Model } = require('objection');
const knex = require('./util/database');
const User = require('./models/User');
const Course = require('./models/Course');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Bind Knex instance to Objection.js
Model.knex(knex);

const JWT_SECRET = 'hiiiiii';
const saltRounds = 10;

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
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


// Register Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.query().insert({ name, email, password: hashedPassword });

    const token = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'User Registered Successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.query().findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login Successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
});

// Create Course Endpoint
app.post('/create-course', authenticateJWT, async (req, res) => {
    console.log('input -->', req.body);
  const { name, image, startDate, endDate, duration, rating, mentor } = req.body;

  try {
    await Course.query().insert({ name, image, startDate, endDate, duration: +duration, rating, mentor });
    res.status(200).json({ message: 'Course Created Successfully' });
  } catch (err) {
      console.log(err);
      
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
});

// Fetch Courses Endpoint
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.query();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});

