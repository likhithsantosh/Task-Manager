const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const auth = require('../middleware/auth');

const datapath = path.join(__dirname,'../data/tasks.json');

router.post('/tasks', auth, (req, res)=>{
    const { title,description, date}= req.body;
    const newtask = {id: Date.now(), title, description, date};
    // read existing tasks
    let tasks =[];
    if(fs.existsSync(datapath)){
        const data = fs.readFileSync(datapath);
        tasks = JSON.parse(data);
    }
    tasks.push(newtask);
    fs.writeFileSync(datapath, JSON.stringify(tasks, null, 2));
    res.status(201).json(newtask);
});

router.get('/tasks', auth, (req, res)=>{
    if(fs.existsSync(datapath)){
        const data = fs.readFileSync(datapath);
        const tasks = JSON.parse(data);
        res.json(tasks);
    }
    else{
        res.json([])
    }
});

//put edit a task

router.put('/tasks/:id',auth, (req, res)=>{
    const id = parseInt(req.params.id);
    const {title, description, date} = req.body;

    let tasks =[];

    if(fs.existsSync(datapath)){
        const data = fs.readFileSync(datapath);
        tasks = JSON.parse(data);
    }
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return res.status(404).json({messege:'task not found'});

    tasks[index] = {id, title, description, date};
    fs.writeFileSync(datapath, JSON.stringify(tasks, null, 2));
    res.json(tasks[index]);
})

//delete route
router.delete('/tasks/:id',auth, (req, res)=>{
    const id = Number(req.params.id);
    let tasks =[];

    if(fs.existsSync(datapath)){
        const data = fs.readFileSync(datapath, 'utf-8');

        tasks = JSON.parse(data);
    }
    const filtered = tasks.filter(task => task.id !== id);
    if(filtered.length === tasks.length){
        return res.status(404).json({message : 'task not found'});
    }
    fs.writeFileSync(datapath, JSON.stringify(filtered, null, 2));
    res.json({message : 'task deleted'});
});

module.exports= router;