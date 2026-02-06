export function addTask(tasks, newTask) {
  return [...tasks, newTask];
}

export function updateTask(tasks, updatedTask) {
  return tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
}

export function deleteTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}
