const express = require('express');  
const { Pool } = require('pg');  
require('dotenv').config();  

const app = express();  
app.use(express.json());  

const pool = new Pool({  
  user: process.env.DB_USER,  
  password: process.env.DB_PASSWORD,  
  host: process.env.DB_HOST,  
  port: process.env.DB_PORT,  
  database: process.env.DB_NAME  
});  

// GET all tasks  
app.get('/tasks', async (req, res) => {  
  try {  
    const { rows } = await pool.query('SELECT * FROM tasks');  
    res.json(rows);  
  } catch (err) {  
    res.status(500).json({ error: err.message });  
  }  
});  

app.listen(3000, () => console.log('API running on http://localhost:3000/tasks'));  
