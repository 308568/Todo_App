import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expectedTime: {
    type: Number, // Expected time in minutes
    required: true,
  },
  actualTime: {
    type: Number, // Actual time taken to complete the task in minutes
    default: 0,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // referencing User model to connect to users collection in MongoDB
    required: true,
  },
  startTime: {
    type: Date, // The time when the task is started
    default: null,
  },
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
