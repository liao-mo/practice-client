import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  useEffect(() => {
    // Fetch tasks from your API
    async function fetchTasks() {
      try {
        //setup config for the GET task request
        const token = Cookies.get("jwt");
        const config = {
          method: "get",
          url: "http://localhost:3000/tasks",
          params: {
            limit: 10,
            skip: 0,
            sortBy: "createdAt:desc",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const rawData = await axios.request(config);
        console.log(rawData.data);
        setTasks(rawData.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  const handleEdit = (taskId) => {
    setEditingTask(taskId);
  };

  const handleComplete = (taskId) => {
    // Update the completed status in the state or send a request to update it in the API
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (taskId) => {
    // Delete the task from the state or send a request to delete it in the API
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleSave = (taskId, newDescription) => {
    // Update the task description in the state or send a request to update it in the API
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, description: newDescription } : task
      )
    );

    setEditingTask(null);
  };

  return (
    <div className="tasks-container">
      {tasks.map((task) => (
        <div key={task._id} className="task">
          {editingTask === task.id ? (
            <div>
              <input
                type="text"
                value={task.description}
                onChange={(e) => handleSave(task.id, e.target.value)}
              />
              <button>save</button>
            </div>
          ) : (
            <>
              <span className={task.completed ? "completed" : ""}>
                {task.description}
              </span>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleComplete(task.id)}
              />
              <button onClick={() => handleEdit(task.id)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
