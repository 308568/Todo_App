import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");
  const [expectedTime, setExpectedTime] = useState("");
  
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchtodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/todo/fetch", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTodos(response.data.todos);
        setError(null);
      } catch (error) {
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };
    fetchtodos();
  }, []);

  const todoCreate = async () => {
    if (!newTodo || !description || !expectedTime) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/todo/create",
        {
          text: newTodo,
          description: description,
          expectedTime: expectedTime,
          completed: false,
          startTime: Date.now(),
        },
        { withCredentials: true }
      );
      setTodos([...todos, response.data.newTodo]);
      setNewTodo("");
      setDescription("");
      setExpectedTime("");
    } catch (error) {
      setError("Failed to create todo");
    }
  };

  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    const currentTime = Date.now();

    if (todo.completed) {
      const actualTime = (currentTime - todo.startTime) / 60000;  // Convert to minutes
      try {
        const response = await axios.put(
          `http://localhost:5000/todo/update/${id}`,
          {
            ...todo,
            completed: !todo.completed,
            actualTime: actualTime,
          },
          { withCredentials: true }
        );
        setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
      } catch (error) {
        setError("Failed to update todo status");
      }
    } else {
      try {
        const response = await axios.put(
          `http://localhost:5000/todo/update/${id}`,
          {
            ...todo,
            completed: !todo.completed,
            startTime: currentTime,
          },
          { withCredentials: true }
        );
        setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
      } catch (error) {
        setError("Failed to update todo status");
      }
    }
  };

  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      setError("Failed to delete todo");
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:5000/user/logout", {
        withCredentials: true,
      });
      toast.success("User logged out successfully");
      navigateTo("/login");
      localStorage.removeItem("jwt");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="my-10 bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center text-gray-700">Todo App</h1>

      {/* Create Todo Inputs */}
      <div className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Add a new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && todoCreate()}
            className="w-full p-3 border rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Expected time (mins)"
            value={expectedTime}
            onChange={(e) => setExpectedTime(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none"
          />
        </div>
        <button
          onClick={todoCreate}
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-900 duration-300 w-full"
        >
          Add Todo
        </button>
      </div>

      {/* Todo List */}
      {loading ? (
        <div className="text-center justify-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-4 bg-gray-200 rounded-md"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => todoStatus(todo._id)}
                  className="mr-4"
                />
                <div>
                  <span
                    className={`${
                      todo.completed ? "line-through text-gray-500" : "font-semibold"
                    } `}
                  >
                    {todo.text}
                  </span>
                  <div className="text-sm text-gray-600">{todo.description}</div>
                  {todo.expectedTime && (
                    <div className="text-xs text-gray-500">
                      Expected Time: {todo.expectedTime} mins
                    </div>
                  )}
                  {todo.completed && todo.actualTime && (
                    <div className="text-xs text-green-600">
                      Actual Time: {todo.actualTime.toFixed(2)} mins
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => todoDelete(todo._id)}
                className="text-red-500 hover:text-red-800 duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Remaining Todos */}
      <p className="mt-4 text-center text-sm text-gray-700">
        {remainingTodos} remaining todos
      </p>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-500 mx-auto block"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
