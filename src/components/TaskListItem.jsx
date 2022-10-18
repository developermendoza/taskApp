import React from "react";
import { Button, Form } from "react-bootstrap";

const TaskListItem = ({
  todo,
  handleShowEdit,
  handleDeleteItem,
  handleTodoComplete,
}) => {
  return (
    <div>
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
    </div>
  );
};

export default TaskListItem;
