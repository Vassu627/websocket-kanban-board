import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import Select from "react-select";
import TaskChart from "./TaskChart";

const socket = io("http://localhost:5000");

const columns = ["To Do", "In Progress", "Done"];

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const categoryOptions = [
  { value: "Bug", label: "Bug" },
  { value: "Feature", label: "Feature" },
  { value: "Enhancement", label: "Enhancement" },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.on("sync:tasks", (data) => {
      setTasks(data);
    });

    return () => socket.off("sync:tasks");
  }, []);

  const createTask = () => {
    socket.emit("task:create", {
      id: Date.now().toString(),
      title: "New Task",
      column: "To Do",
      priority: "Low",
      category: "Feature",
      attachments: [],
    });
  };

  const deleteTask = (id) => {
    socket.emit("task:delete", id);
  };

  const updateTask = (updatedTask) => {
    socket.emit("task:update", updatedTask);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newColumn = result.destination.droppableId;

    socket.emit("task:move", {
      id: taskId,
      column: newColumn,
    });
  };

  return (
  <div className="board-container">
    <header className="board-header">
      <h1>Real-Time Kanban Board</h1>
      <button onClick={createTask}>+ Add Task</button>
    </header>

    <div className="chart-wrapper">
      <div className="chart-container">
        <TaskChart tasks={tasks} />
      </div>
    </div>

    <DragDropContext onDragEnd={onDragEnd}>
      <div className="columns">
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3>{col}</h3>

                {tasks
                  .filter((t) => t.column === col)
                  .map((task, index) => (
                    <Draggable
                      draggableId={String(task.id)}
                      index={index}
                      key={task.id}
                    >
                      {(provided) => (
                        <div
                          className="task-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) =>
                              updateTask({
                                ...task,
                                title: e.target.value,
                              })
                            }
                          />

                          <Select
                            options={priorityOptions}
                            value={priorityOptions.find(
                              (o) => o.value === task.priority
                            )}
                            onChange={(selected) =>
                              updateTask({
                                ...task,
                                priority: selected.value,
                              })
                            }
                          />

                          <Select
                            options={categoryOptions}
                            value={categoryOptions.find(
                              (o) => o.value === task.category
                            )}
                            onChange={(selected) =>
                              updateTask({
                                ...task,
                                category: selected.value,
                              })
                            }
                          />

                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              const url =
                                URL.createObjectURL(file);

                              updateTask({
                                ...task,
                                attachments: [
                                  ...task.attachments,
                                  url,
                                ],
                              });
                            }}
                          />

                          {task.attachments.map((file, i) => (
                            <img
                              key={i}
                              src={file}
                              alt="attachment"
                            />
                          ))}

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteTask(task.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  </div>
);

}
