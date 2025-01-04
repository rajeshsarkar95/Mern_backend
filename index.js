const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

app.get("/", (req, res) => res.send("Todo API is running"));

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  const task = new Task({ text });
  await task.save();
  res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const task = await Task.findByIdAndUpdate(
    id,
    { text, completed },
    { new: true }
  );
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
