const express = require('express');
const tasksRoutes = require('./routes/tasks.routes.js');

const app = express();

app.use(express.json());
app.use('/api/tasks', tasksRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;