const express = require('express');
const mongoose = require('mongoose');
const Task =require('./models/task');


const app=express();

const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/database';

mongoose.connect(MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

app.use(express.json());

app.listen(PORT,()=>{
    console.log("server started o port ${PORT}");
});

//create a task
app.post('/tasks',async(req,res)=>{
    try {
        const task= new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

//get all tasks
app.get('/tasks',async(req,res)=>{
    try {
        const tasks=await Task.find();
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific task by ID
app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).send('Task not found');
      }
      res.send(task);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Update a task by ID
  app.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates' });
    }
  
    try {
      const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  
      if (!task) {
        return res.status(404).send('Task not found');
      }
  
      res.send(task);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Delete a task by ID
  app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).send('Task not found');
      }
      res.send(task);
    } catch (error) {
      res.status(500).send(error);
    }
  });