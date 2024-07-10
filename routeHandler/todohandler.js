/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
const checkAuthentication = require('../middlewares/checkAunthentication');

// eslint-disable-next-line new-cap
const Todo = new mongoose.model('Todo', todoSchema);
// eslint-disable-next-line new-cap
const User = new mongoose.model('user', userSchema);

// GET ALL THE TODOS
router.get('/', checkAuthentication, async (req, res) => {
    try {
        const todos = await Todo.find().populate('user', 'username -_id').sort({ date: 1 });
        if (todos != null) {
            res.status(200).json({
                message: 'Todo founded!',
                todos,
            });
            console.log('Todo founded!');
        } else {
            res.status(404).send({
                message: 'No todo found',
            });
        }
    } catch {
        res.sendStatus(500);
    }
});

// find todoswith status completed
router.get('/findCompleted', checkAuthentication, async (req, res) => {
    try {
        const data = await new Todo().findCompleted();
        res.status(200).json({
            message: 'Todo founded!',
            data,
        });
        console.log(data);
    } catch (err) {
        res.sendStatus(500);
    }
});
// GET a TODO BY ID
router.get('/:id', checkAuthentication, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo != null) {
            res.status(200).json({
                message: 'Todo founded!',
                todo,
            });
            console.log('Todo founded!');
        } else {
            res.status(404).send({
                message: 'Todo not found',
            });
        }
    } catch {
        res.sendStatus(500);
    }
});

// POST A TODO
router.post('/', checkAuthentication, async (req, res) => {
    try {
        // await Todo(req.body).save();
        const newTodo = new Todo({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            date: req.body.date,
            user: req.user.userId,
        });
        console.log(newTodo);
        const todo = await newTodo.save();

        await User.findByIdAndUpdate(req.user.userId, { $push: { todos: todo._id } });
        await res.status(200).json({
            message: 'Todo added successfully',
            todo: req.body,
        });
        console.log('Todo added successfully');
    } catch {
        res.sendStatus(500);
    }
});

// POST MULTIPLE TODO
router.post('/all', checkAuthentication, async (req, res) => {
    try {
        await Todo.insertMany(req.body);
        res.status(200).json({
            message: 'Todo(s) added successfully',
            todos: req.body,
        });
        console.log('Todo added successfully');
    } catch {
        res.sendStatus(500);
    }
});

// UPDATE A TODO
router.put('/:id', checkAuthentication, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (todo != null) {
            res.status(200).json({
                message: 'Todo updated successfully',
                todo,
            });
            console.log('Todo updated successfully');
        } else {
            res.status(404).send({
                message: 'Todo not found',
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// DELETE A TODO
router.delete('/:id', checkAuthentication, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (todo != null) {
            res.status(200).json({
                message: 'Todo deleted successfully',
                todo,
            });
            console.log('Todo deleted successfully');
        } else {
            res.status(404).send({
                message: 'Todo not found',
            });
        }
    } catch {
        res.sendStatus(500);
    }
});

module.exports = router;
