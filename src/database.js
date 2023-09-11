const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/restApiDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb://127.0.0.1:27017/tasks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((db) => console.log('😍 DB is connected'))
  .catch((err) => console.error(err));
