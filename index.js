const { Pool } = require('pg');  
const express = require('express');  
const cors = require('cors'); // Make sure cors is imported
require('dotenv').config();  

// Database connection  
const pool = new Pool({  
  user: process.env.DB_USER,  
  password: process.env.DB_PASSWORD,  
  host: process.env.DB_HOST,  
  port: process.env.DB_PORT,  
  database: process.env.DB_NAME  
});  

// Express app  
const app = express();  
app.use(express.json());  
app.use(cors()); // Use cors middleware

// API Routes  
app.get('/api/tasks', async (req, res) => {  
  try {  
    const { rows } = await pool.query('SELECT * FROM tasks');  
    res.json(rows);  
  } catch (err) {  
    res.status(500).json({ error: err.message });  
  }  
});  

app.post('/api/tasks', async (req, res) => {  
  try {  
    const { task } = req.body;  
    if (!task) throw new Error('Task content required');  
    const { rows } = await pool.query(  
      'INSERT INTO tasks (task) VALUES ($1) RETURNING *',  
      [task]  
    );  
    res.status(201).json(rows[0]);  
  } catch (err) {  
    res.status(400).json({ error: err.message });  
  }  
});  

app.delete('/api/tasks/:id', async(req,res)=> {
  try {
    const {id} = req.params; // Corrected from req.param to req.params
    const {rowCount} = await pool.query('DELETE FROM tasks WHERE id=$1',[id]);
    res.status(rowCount ? 200: 404).json({
      success: !! rowCount,
      message: rowCount ? 'Task deleted': 'Task not found'
    });
  } catch (err) {
    res.status(500).json({error:err.message});
  }
});

app.patch('/api/tasks/:id', async (req, res)=>{ // Corrected from /tasks/id to /api/tasks/:id
  try {
    const {id} = req.params; // Corrected from req.param to req.params
    const {done} = req.body;
    const {rows} = await pool.query(
      'UPDATE tasks SET done = $1 WHERE id = $2 RETURNING *',[done, id]
    );
    res.status(rows.length ? 200: 404).json(rows[0] || {error: 'Task not found'});
  } 
  catch (err){
    res.status(500).json({error: err.message});
  }
});

// Start server OR run one-time scripts  
if (process.argv[2] === '--api') {  
  // Start API server  
  // Render automatically assigns a port, so use process.env.PORT
  const PORT = process.env.PORT || 3000; // Use Render's assigned port or default to 3000
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));  
} else {  
  // One-time script mode (example: list tasks)  
  (async () => {  
    const { rows } = await pool.query('SELECT * FROM tasks');  
    console.log('Tasks:', rows);  
    pool.end();  
  })();  
}