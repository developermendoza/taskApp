import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import AddTask from "./AddTask";
import TaskListItem from "./TaskListItem";

const TaskList = ({ todoList, setTodoList }) => {
  const [todoItemEdit, settodoItemEdit] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [todoItem, settodoItem] = useState("");
  const [editItem, setEditItem] = useState("");

  const [show, setShow] = useState(false);

  // const [todoList, setTodoList] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseEdit = () => setShowEdit(false);

  const handleShowEdit = (id) => {
    setShowEdit(true);
    console.log(id);
    const editItem = todoList.filter((todo) => todo._id === id);
    console.log(editItem);
    settodoItemEdit(editItem);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (todoItem !== "") {
      fetch("http://localhost:8080/addTodo", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todoItem,
        }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          setTodoList([data, ...todoList]);
          settodoItem("");
          handleClose();
        });
    }
  };

  const handleDeleteItem = (id) => {
    if (id !== "") {
      fetch("http://localhost:8080/deleteTodo", {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
        }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          const newTodoList = todoList.filter((item) => item._id !== data._id);
          setTodoList(newTodoList);
        });
    }
  };
  const handleTodoComplete = (task) => {
    const isTaskCompleted = !task.completed;
    console.log("isTaskCompleted: ", isTaskCompleted);
    fetch("http://localhost:8080/updateTodo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: task._id,
        item: task.item,
        completed: isTaskCompleted,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log("data from the completed task: ", data);
        const newList = todoList.map((obj) => {
          if (obj._id === data._id) {
            return { ...obj, completed: data.completed };
          }
          return obj;
        });
        console.log("newList: ", newList);
        setTodoList(newList);
      });
  };
  const handleOnChange = (e) => {
    const { value } = e.target;
    settodoItem(value);
  };
  const handleOnSubmitEdit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/updateTodo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: todoItemEdit[0]._id,
        item: editItem,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        const newList = todoList.map((obj) => {
          if (obj._id === data._id) {
            return { ...obj, item: editItem };
          }
          return obj;
        });
        setTodoList(newList);
        settodoItemEdit("");
        setEditItem("");
        handleCloseEdit();
      });
  };
  const handleOnChangeEdit = (e) => {
    setEditItem(e.target.value);
  };
  return (
    <div>
      <ul>
        {todoList.map((todo) => (
          <li key={todo._id} className="d-flex">
            {todo.item}{" "}
            <Button variant="warning" onClick={() => handleShowEdit(todo._id)}>
              Edit
            </Button>{" "}
            |{" "}
            <Button variant="danger" onClick={() => handleDeleteItem(todo._id)}>
              Delete
            </Button>
            <Form.Group className="mb-3 ml-3" controlId={`formid${todo._id}`}>
              <Form.Check
                name={`formid${todo._id}`}
                type="checkbox"
                label="Completed"
                checked={todo.completed}
                onChange={() => handleTodoComplete(todo)}
              />
            </Form.Group>
          </li>
        ))}
      </ul>
      <TaskListItem />
      {/* <AddTask /> */}
      <Button variant="primary" onClick={handleShow}>
        Add a task
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOnSubmit} id="addTodoForm">
            <Form.Group role="form" className="mb-3" controlId="formText">
              <Form.Control
                placeholder="e.x. Go to the gym"
                onChange={handleOnChange}
                value={todoItem}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" form="addTodoForm">
            Save To Do
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit List Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOnSubmitEdit} id="addTodoForm">
            <Form.Group role="form" className="mb-3" controlId="formText">
              <Form.Control
                style={{ fontStyle: "italic" }}
                placeholder={todoItemEdit[0]?.item}
                onChange={handleOnChangeEdit}
                value={editItem}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button type="submit" form="addTodoForm">
            Save To Do
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskList;
