const { app } = require('electron');
const { createWindow } = require('./main');

// conectar con la base de datos

require('./database');

app.whenReady().then(createWindow);
app.allowRendererProcessReuse = false;
