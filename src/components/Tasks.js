import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  useEffect(() => {
    console.log("useEffect");
    // Fetch tasks from your API
    async function fetchTasks() {
      try {
        //setup config for the GET task request
        const rawData = await axios.get("http://localhost:3000/tasks", {
          params: {
            limit: 10,
            skip: 0,
            sortBy: "createdAt:desc",
          },
        });
        // console.log(rawData.data);
        setTasks(rawData.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  //update tasks to the database
  function updateTask(currentTasks, id) {
    let task = currentTasks.find((t) => t._id === id);
    let { description, completed } = task;
    axios.patch(`http://localhost:3000/tasks/${id}`, {
      description,
      completed,
    });
  }

  const handleEdit = (taskId) => {
    setEditingTask(taskId);
  };

  const handleComplete = (id) => {
    // Update the completed status in the state or send a request to update it in the API
    let currentTasks = tasks.map((task) =>
      task._id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(currentTasks);
    updateTask(currentTasks, id);
  };

  const handleDelete = (taskId) => {
    // Delete the task from the state or send a request to delete it in the API
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  const handleSave = (taskId, newDescription) => {
    // Update the task description in the state or send a request to update it in the API
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, description: newDescription } : task
      )
    );

    setEditingTask(null);
  };

  return (
    <div className="tasks-container">
      {tasks.map((task) => (
        <div key={task._id} className="task">
          {editingTask === task._id ? (
            <div>
              <input
                type="text"
                value={task.description}
                onChange={(e) => handleSave(task._id, e.target.value)}
              />
              <button>save</button>
            </div>
          ) : (
            <>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleComplete(task._id)}
              />
              <span
                className={`task-description ${
                  task.completed ? "completed" : ""
                }`}
              >
                {task.description}
              </span>
              {/* 
              <button onClick={() => handleEdit(task._id)}>Edit</button>
              <button onClick={() => handleDelete(task._id)}>Delete</button> */}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
