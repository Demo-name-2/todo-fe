import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../../../config";

import { BsCircleFill, BsFillCheckCircleFill } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";

import "./DisplayTodoComponent.css";

const DisplayTodoComponent = () => {
  const [toDoItems, setToDoItems] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setToDoItems(response.data);
        } else {
          setToDoItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setToDoItems([]);
      });
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() === "") return alert("Task cannot be empty!");
    
    axios
      .post(`${BASE_URL}`, { todoItem: newTask, done: false })
      .then((response) => {
        if (response.status === 201) {
          setToDoItems([...toDoItems, response.data]);
          setNewTask(""); // Clear input field after adding
        }
      })
      .catch((error) => {
        alert(`Status (${error.response?.status}) - ${error.response?.data?.message}`);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${BASE_URL}/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setToDoItems((prevItems) => prevItems.filter((item) => item._id !== id));
        }
      })
      .catch((error) => {
        alert(`Status (${error.response?.status}) - ${error.response?.data?.message}`);
      });
  };

  const handleToggleDone = (id) => {
    axios
      .put(`${BASE_URL}/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setToDoItems((prevItems) =>
            prevItems.map((item) =>
              item._id === id ? { ...item, done: !item.done } : item
            )
          );
        }
      })
      .catch((error) =>
        alert(`Status (${error.response?.status}) - ${error.response?.data?.message}`)
      );
  };

  return (
    <div className="todo-container">
      {/* Input field and Add Button */}

      {/* Task List */}
      {toDoItems.length === 0 ? (
        <h2 className="info">NO TASKS TO DO!!</h2>
      ) : (
        toDoItems.map((item) => (
          <div key={item._id} className="todo-item">
            <span onClick={() => handleToggleDone(item._id)}>
              {item.done ? <BsFillCheckCircleFill /> : <BsCircleFill />}
            </span>

            <span className="task" onClick={() => handleToggleDone(item._id)}>
              {item.done ? <del>{item.todoItem}</del> : item.todoItem}
            </span>

            <FiTrash2 className="delete-icon" onClick={() => handleDelete(item._id)} />
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayTodoComponent;
