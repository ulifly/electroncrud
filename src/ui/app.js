const taskForm = document.querySelector('#taskForm');
const taskName = document.querySelector('#taskName');
const taskDescription = document.querySelector('#taskDescription');

const { ipcRenderer } = require('electron');

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
  console.log(args);
});
