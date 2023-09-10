const { BrowserWindow, ipcMain } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // eslint-disable-next-line comma-dangle
      nodeIntegration: true
    // eslint-disable-next-line comma-dangle
    }
  });
  win.loadFile('./src/index.html');
}

ipcMain.on('new-task', (e, task) => {
  console.log(task);
});

module.exports = { createWindow };
