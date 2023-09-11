const { BrowserWindow, ipcMain } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // enableRemoteModule: true,
    },
  });
  win.loadFile('./src/index.html');
}

ipcMain.on('new-task', async (e, args) => {
  const newTask = new Task(args);
  const taskSaved = await newTask.save();
  console.log(taskSaved);
  e.reply('new-task-saved', taskSaved);
});

module.exports = { createWindow };
