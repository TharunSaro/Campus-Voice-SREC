import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { reg_no, name, department, gender, phone, email, password } = req.body;

    // Validate required fields
    if (!reg_no || !name || !department || !gender || !phone || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Check if email or reg_no already exists
    const checkUserQuery = `
      SELECT email, reg_no 
      FROM users 
      WHERE email = $1 OR reg_no = $2
    `;
    const existingUser = await pool.query(checkUserQuery, [email, reg_no]);

    if (existingUser.rows.length > 0) {
      if (existingUser.rows[0].email === email) {
        return res.status(400).json({ 
          error: 'Email already registered' 
        });
      }
      if (existingUser.rows[0].reg_no === reg_no) {
        return res.status(400).json({ 
          error: 'Registration number already exists' 
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const insertUserQuery = `
      INSERT INTO users (reg_no, name, department, gender, phone, email, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, reg_no, name, department, gender, phone, email, created_at
    `;
    
    const result = await pool.query(insertUserQuery, [
      reg_no,
      name,
      department,
      gender,
      phone,
      email,
      hashedPassword
    ]);

    const newUser = result.rows[0];

    // Return success response with user info (no password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        reg_no: newUser.reg_no,
        name: newUser.name,
        department: newUser.department,
        gender: newUser.gender,
        phone: newUser.phone,
        email: newUser.email,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Verify user exists
    const getUserQuery = `
      SELECT id, reg_no, name, department, gender, phone, email, password, created_at
      FROM users 
      WHERE email = $1
    `;
    const result = await pool.query(getUserQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Compare hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Generate JWT token (1 day expiry)
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        reg_no: user.reg_no
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return token and user details (no password)
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        reg_no: user.reg_no,
        name: user.name,
        department: user.department,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
});

export default router;

