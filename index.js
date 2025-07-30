const { Pool } = require('pg');  
const express = require('express');  
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

// API Routes  
app.get('/tasks', async (req, res) => {  
  try {  
    const { rows } = await pool.query('SELECT * FROM tasks');  
    res.json(rows);  
  } catch (err) {  
    res.status(500).json({ error: err.message });  
  }  
});  

app.post('/tasks', async (req, res) => {  
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

// Start server OR run one-time scripts  
if (process.argv[2] === '--api') {  
  // Start API server  
  app.listen(3000, () => console.log('API running on http://localhost:3000'));  
} else {  
  // One-time script mode (example: list tasks)  
  (async () => {  
    const { rows } = await pool.query('SELECT * FROM tasks');  
    console.log('Tasks:', rows);  
    pool.end();  
  })();  
}
app.delete('/tsks/:id', async(req,res)=> {try {
  const {id} = req.params;
  const {rowCount} = await
  pool.query('DELETE FROM tasks Where id=$1',[id]);
  res.status(rowCount ? 200: 404).json({
    success: !! rowCount,
    message: rowCount ? 'Task deleted': 'Task not found'

  });

}catch (err) {
  res.status(500).json({error:err.message});
}
})
app.patch('/tasks/id', async (req, res)=>{
  try {
    const {id} = req.param;
    const {done} = req.body;
    const {rows} = await pool.query(
      'UPDATE tasks SET done = $1 WHERE id = $2 RETURNING *',[done, id]
    );
    res.status(rows.length ? 200: 404).json(rows[0] || {error: 'Task not found'}

    );
  } 
  catch (err){
    res.status(500).json({error: err.message})
  }
});
 