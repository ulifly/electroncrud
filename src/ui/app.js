/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const taskForm = document.querySelector('#taskForm');
const taskName = document.querySelector('#taskName');
const taskDescription = document.querySelector('#taskDescription');
const taskList = document.querySelector('#taskList');

const { ipcRenderer } = require('electron');

let tasks = []; // Array de tareas

function editTask(id) {
  alert(`click editar ${id}`);
}
function deleteTask(id) {
  const result = confirm('¿Desea eliminar la tarea?');
  if (result) {
    ipcRenderer.send('delete-task', id);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.map((t) => {
    taskList.innerHTML += `
      <li>
        <h2>Tarea: ${t.name}</h2>
        <p>Descripcion: ${t.description}</p>
        <button onclick="editTask('${t._id}')" >Editar</button>
        <button onclick="deleteTask('${t._id}')" >Eliminar</button>
      </li>
    `;
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const task = {
    name: taskName.value,
    description: taskDescription.value,
  };

  ipcRenderer.send('new-task', task);
  taskForm.reset();
});

ipcRenderer.on('new-task-saved', (e, args) => {
  const newTask = JSON.parse(args);
  tasks.push(newTask);
  renderTasks(tasks);
  alert('Tarea guardada');
});

ipcRenderer.send('get-tasks');

ipcRenderer.on('get-tasks', (e, args) => {
  const tasksReceived = JSON.parse(args);
  tasks = tasksReceived;

  renderTasks(tasks);
});

ipcRenderer.on('delete-task-success', (e, args) => {
  const taskDeleted = JSON.parse(args);
  const newTasks = tasks.filter((t) => (t._id !== taskDeleted._id));
  tasks = newTasks;
  renderTasks(tasks);
});
