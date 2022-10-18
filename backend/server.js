const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

require("./db/conn");

const getTodos = require("./routes/todos").getTodos;
const addTodo = require("./routes/todos").addTodo;
const deleteTodo = require("./routes/todos").deleteTodo;
const updateTodo = require("./routes/todos").updateTodo;

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
const port = 8080;
app.use(cors());

app.get("/", urlencodedParser, getTodos);
app.post("/addTodo", jsonParser, addTodo);
app.delete("/deleteTodo", jsonParser, deleteTodo);
app.patch("/updateTodo", jsonParser, updateTodo);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
