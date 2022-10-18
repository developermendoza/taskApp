import { useState, useEffect } from "react";
import nextId from "react-id-generator";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);

  const [todoItem, settodoItem] = useState("");
  const [todoItemEdit, settodoItemEdit] = useState("");

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [editItem, setEditItem] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseEdit = () => setShowEdit(false);

  useEffect(() => {
    fetch("http://localhost:8080/")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setTodoList(data);
      })
      .catch((err) => {
        console.error("error fetching data: ", err);
      })
      .finally(() => console.log("end loading here"));
  }, []);

  const handleOnChange = (e) => {
    const { value } = e.target;
    settodoItem(value);
  };

  const handleTodoComplete = (task) => {
    const isTaskCompleted = !task.completed;
    // console.log("test", id);
    // console.log("isTaskCompleted", isTaskCompleted);
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
        console.log(data);
        const newList = todoList.map((obj) => {
          if (obj._id === data._id) {
            return { ...obj, completed: isTaskCompleted };
          }
          return obj;
        });
        setTodoList(newList);
      });
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

  const handleShowEdit = (id) => {
    setShowEdit(true);
    console.log(id);
    const editItem = todoList.filter((todo) => todo._id === id);
    console.log(editItem);
    settodoItemEdit(editItem);
  };

  const handleOnChangeEdit = (e) => {
    setEditItem(e.target.value);
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
  console.log("todoList: ", todoList);
  return (
    <div className="App">
      <h1>To Do Web App</h1>
      <div>
        <h2>My To Do List</h2>
        <ul>
          {todoList.map((todo) => (
            <li key={todo._id} className="d-flex">
              {todo.item}{" "}
              <Button
                variant="warning"
                onClick={() => handleShowEdit(todo._id)}
              >
                Edit
              </Button>{" "}
              |{" "}
              <Button
                variant="danger"
                onClick={() => handleDeleteItem(todo._id)}
              >
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
      </div>
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
}

export default App;
