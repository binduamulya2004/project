const express= require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
//Protects routes by ensuring only authenticated users can access them.
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
 
  //Retrieves the value of the Authorization header from the incoming HTTP request.
  //The string Bearer will be returned
  // /?. (Optional Chaining):Safely accesses the Authorization header,
   //The result of .split(' ') would be:['Bearer', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abcdef123456']


  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided' });
  }

  //This function verifies the JSON Web Token (JWT) provided in the request.
  //If the token is valid, the user parameter contains the decoded payload.
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
    req.user = user; // Save user information from token to request object
    next(); // It is used to pass control to the next middleware function in the stack.
  });
};


// Register Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body; //its a json obj  { " ":" " , "":"",}
 
  //to check  email address already exists in the users table.
  //The ? is a placeholder for parameterized queries, which helps prevent SQL injection attacks by sanitizing user inputs.

  const checkuserquery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkuserquery, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
 
    if (results.length > 0) { //1/2/3 -no of rows matching
      return res.status(400).json({ message: 'Email already exists' });
    }
 
    // Hash password before saving to database
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds are set to 10 This means bcrypt will process the password 10 times to generate a more secure hash.
 
      const insertquery = 'INSERT INTO users(name, email, password) VALUES(?,?,?)';
      db.query(insertquery, [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).send(err);


        // Generate JWT token ,JWT_SECRET is the secret key used to sign the token
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
      const user = results[0]; //results array will contain the rows returned by the database.
 
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

// Fetch users
app.get('/users', (req, res) => {
  const query = 'SELECT id, name, email FROM users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});
// Fetch user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, name, email FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results[0]);
  });
});


// Update user
const bcrypt = require('bcrypt');

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body; // Only name and email are allowed for updates

    // Update query without password
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    const params = [name, email, id];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).json({ message: 'Failed to update user' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    });
});



// Delete user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete user' });
    res.status(200).json({ message: 'User deleted successfully' });
  });
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 




