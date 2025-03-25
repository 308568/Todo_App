import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controller/todo.controller.js";
import { authenticate } from "../middleware/authorize.js";

const router = express.Router();

// Create a new todo
router.post("/create", authenticate, createTodo);

// Fetch all todos for the authenticated user
router.get("/fetch", authenticate, getTodos);

// Update a todo by its ID
router.put("/update/:id", authenticate, updateTodo);

// Delete a todo by its ID
router.delete("/delete/:id", authenticate, deleteTodo);

export default router;
