import React from "react";
import styles from "./TaskListItem.module.css";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

const TaskListItem = ({ todo, handleShowEdit, handleTodoComplete }) => {
  return (
    <Container className={styles.taskListItem}>
      <Row>
        <Col
          sm={10}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => handleShowEdit(todo._id)}
        >
          <div key={todo._id} className="d-flex">
            {todo.item}{" "}
          </div>
        </Col>
        <Col sm={2} style={{ textAlign: "center" }}>
          <Form.Group controlId={`formid${todo._id}`}>
            <Form.Check
              name={`formid${todo._id}`}
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleTodoComplete(todo)}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskListItem;
