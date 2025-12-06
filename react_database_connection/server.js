// server.js - Updated with better POST handling
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware - IMPORTANT: Add body parser
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing form data

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'react-dev',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || '',
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database: react-dev');
    
    // Test table access
    client.query('SELECT COUNT(*) FROM "testMenu"', (err, result) => {
      if (err) {
        console.error('❌ Table access error:', err.message);
      } else {
        console.log(`📊 Table "testMenu" has ${result.rows[0].count} rows`);
      }
      release();
    });
  }
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PostgreSQL API is running',
    note: 'Table name is case-sensitive: "testMenu"',
    endpoints: {
      getMenu: 'GET /api/menu',
      postMenu: 'POST /api/menu',
      deleteMenu: 'DELETE /api/menu/:id'
    }
  });
});

// API endpoint to get all menu items
app.get('/api/menu', async (req, res) => {
  console.log('📥 GET /api/menu');
  
  try {
    const result = await pool.query('SELECT * FROM "testMenu" ORDER BY id');
    console.log(`✅ Returning ${result.rows.length} items`);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ GET Error:', err.message);
    res.status(500).json({ 
      error: 'Database error',
      details: err.message 
    });
  }
});

// API endpoint to create new menu item - FIXED
app.post('/api/menu', async (req, res) => {
  console.log('📤 POST /api/menu received');
  console.log('Request body:', req.body);
  
  try {
    const { title, description } = req.body;
    
    // Validation
    if (!title || !description) {
      console.log('❌ Validation failed: Missing fields');
      return res.status(400).json({ 
        error: 'Validation error',
        details: 'Both title and description are required',
        received: { title, description }
      });
    }
    
    console.log(`📝 Inserting: "${title}" - "${description}"`);
    
    // Use parameterized query to prevent SQL injection
    const result = await pool.query(
      'INSERT INTO "testMenu" (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    
    console.log('✅ Insert successful:', result.rows[0]);
    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    console.error('❌ POST Error:', err.message);
    console.error('Full error:', err);
    
    res.status(500).json({ 
      error: 'Database error',
      details: err.message,
      hint: 'Table name is case-sensitive. Make sure to use "testMenu" with quotes.'
    });
  }
});

// API endpoint to delete menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM "testMenu" WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Menu item deleted',
      deletedItem: result.rows[0]
    });
  } catch (err) {
    console.error('❌ DELETE Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a simple test endpoint for POST
app.post('/api/test-post', (req, res) => {
  console.log('🧪 Test POST received:', req.body);
  res.json({ 
    success: true, 
    message: 'Test endpoint works!',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📋 Test these endpoints:`);
  console.log(`   GET  http://localhost:${port}/api/menu`);
  console.log(`   POST http://localhost:${port}/api/menu`);
  console.log(`   POST http://localhost:${port}/api/test-post`);
});