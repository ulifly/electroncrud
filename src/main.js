const { BrowserWindow, ipcMain } = require('electron');

const Task = require('./models/Task');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  win.loadFile('./src/index.html');
}

ipcMain.on('new-task', async (e, args) => {
  const newTask = new Task(args);
  const taskSaved = await newTask.save();
  console.log(taskSaved);
  e.reply('new-task-saved', JSON.stringify(taskSaved));
});

ipcMain.on('get-tasks', async (e, args) => {
  const tasks = await Task.find();
  e.reply('get-tasks', JSON.stringify(tasks));
});

ipcMain.on('delete-task', async (e, args) => {
  const taskDeleted = await Task.findByIdAndDelete(args);
  e.reply('delete-task-success', JSON.stringify(taskDeleted));
});

ipcMain.on('update-task', async (e, args) => {
  const updatedTask = await Task.findByIdAndUpdate(args.idTaskToUpdate, {
    name: args.name,
    description: args.description,
  }, { new: true });
  e.reply('update-task-success', JSON.stringify(updatedTask));
});

module.exports = { createWindow };
