import Todo from "../model/todo.model.js";

export const createTodo = async (req, res) => {
  // Validate input (text should be present)
  if (!req.body.text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const todo = new Todo({
    text: req.body.text,
    description: req.body.description,  // Ensure description is handled
    expectedTime: req.body.expectedTime ? Number(req.body.expectedTime) : null, // Ensure expectedTime is a number
    completed: req.body.completed || false, // Default to false if not provided
    user: req.user._id, // Associate todo with logged-in user
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json({ message: "Todo Created Successfully", newTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred during todo creation" });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }); // Fetch todos only for the logged-in user
    res.status(200).json({ message: "Todo Fetched Successfully", todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while fetching todos" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo Updated Successfully", todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred during todo update" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred during todo deletion" });
  }
};
