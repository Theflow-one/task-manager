import { useState, useEffect } from 'react';  

function App() {  
  const [tasks, setTasks] = useState([]);  
  const [newTask, setNewTask] = useState('');  
  // 👇 Replace with YOUR Render URL (ends with /tasks)  
  const API_URL = 'https://your-api.onrender.com/tasks';  

  // Load tasks  
  useEffect(() => {  
    fetch(API_URL)  
      .then(res => res.json())  
      .then(setTasks)  
      .catch(err => console.error("API Error:", err));  
  }, []);  

  // Add task  
  const addTask = () => {  
    fetch(API_URL, {  
      method: 'POST',  
      headers: { 'Content-Type': 'application/json' },  
      body: JSON.stringify({ task: newTask })  
    })  
      .then(res => res.json())  
      .then(data => {  
        setTasks([...tasks, data]);  
        setNewTask(''); // Clear input  
      })  
      .catch(err => console.error("POST Error:", err));  
  };  

  return (  
    <div style={{ padding: '20px' }}>  
      <h1>Task Manager</h1>  
      <div>  
        <input  
          type="text"  
          value={newTask}  
          onChange={(e) => setNewTask(e.target.value)}  
          placeholder="Enter task"  
        />  
        <button onClick={addTask}>Add Task</button>  
      </div>  
      <ul>  
        {tasks.map(task => (  
          <li key={task.id}>  
            {task.task}  
            <button onClick={() => console.log("Mark as done:", task.id)}>  
              {task.done ? '✓' : 'Mark Done'}  
            </button>  
          </li>  
        ))}  
      </ul>  
    </div>  
  );  
}  

export default App;