import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8055/items/tasks')
      .then(res => setTasks(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Tehtävät</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}