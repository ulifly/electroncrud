/* eslint-disable no-param-reassign */
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
let updateStatus = false; // Variable para saber si se va a actualizar una tarea o crear una nueva
let idTaskToUpdate = ''; // Variable para guardar el id de la tarea a actualizar

function editTask(id) {
  idTaskToUpdate = id;
  updateStatus = true;
  const task = tasks.find((t) => t._id === id);
  taskName.value = task.name;
  taskDescription.value = task.description;
}

function deleteTask(id) {
  const result = confirm('¿Desea eliminar la tarea?');
  if (result) {
    ipcRenderer.send('delete-task', id);
  }
}

// ----------------renderizar tareas----------------//

function renderTasks(task) {
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
    return t;
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const task = {
    name: taskName.value,
    description: taskDescription.value,
  };

  if (!updateStatus) {
    ipcRenderer.send('new-task', task);// aquí la había cagado
  } else {
    ipcRenderer.send('update-task', { ...task, idTaskToUpdate });
  }

  taskForm.reset();
});

// --------------guardar tarea----------------//

ipcRenderer.on('new-task-saved', (e, args) => {
  const newTask = JSON.parse(args);
  tasks.push(newTask);
  renderTasks(tasks);
  alert('Tarea guardada');
});

// --------------obtener tareas----------------//

ipcRenderer.send('get-tasks');

ipcRenderer.on('get-tasks', (e, args) => {
  const tasksReceived = JSON.parse(args);
  tasks = tasksReceived;

  renderTasks(tasks);
});

// ----------------eliminar tarea------------------//

ipcRenderer.on('delete-task-success', (e, args) => {
  const taskDeleted = JSON.parse(args);
  const newTasks = tasks.filter((t) => (t._id !== taskDeleted._id));
  tasks = newTasks;
  renderTasks(tasks);
});

// ----------------editar tarea------------------//

ipcRenderer.on('update-task-success', (e, args) => {
  const updatedTask = JSON.parse(args);
  tasks = tasks.map((t) => {
    if (t._id === updatedTask._id) {
      t.name = updatedTask.name;
      t.description = updatedTask.description;
    }
    return t;
  });
  renderTasks(tasks);
});
