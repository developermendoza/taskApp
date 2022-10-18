const Todo = require("../schemas/todo");

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({}).sort({ date: -1 });
    res.send(todos);
  } catch (error) {
    console.log("error: ", error);
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await Todo.findByIdAndDelete(id);
    res.send(data);
  } catch (error) {
    console.log("error: ", error);
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id, item, completed } = req.body;
    const data = await Todo.findByIdAndUpdate(id, {
      item,
      completed,
      updatedAt: new Date(),
    });
    res.send(data);
  } catch (error) {
    console.log("error: ", error);
  }
};

const addTodo = async (req, res) => {
  try {
    const { todoItem } = req.body;
    const newTodo = new Todo({
      item: todoItem,
      date: new Date(),
      completed: false,
    });

    const data = await newTodo.save();
    res.send(data);
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports = {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
};
