import { useState, useEffect } from "react";

import TaskAppTitle from "./components/TaskAppTitle";
import TaskList from "./components/TaskList";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);

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

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center">
        <div className="taskApp">
          <h1 style={{ textAlign: "center", paddingBottom: "20px" }}>
            <TaskAppTitle title="My Task List" />
          </h1>
          <div>
            <TaskList todoList={todoList} setTodoList={setTodoList} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
