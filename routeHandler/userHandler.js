const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const userSchema = require('../schemas/userSchema');

// eslint-disable-next-line new-cap
const User = new mongoose.model('user', userSchema);

// Sign up route
router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(200).json({
            message: 'Sign In successfully',
            newUser,
        });
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: 'Sign In failed',
        });
    }
});

// Log in route
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user != null) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                const token = jwt.sign(
                    {
                        username: user.username,
                        // eslint-disable-next-line no-underscore-dangle
                        userId: user._id,
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: '1h',
                        // eslint-disable-next-line prettier/prettier
                    },
                );
                res.status(200).json({
                    message: 'log In successfully',
                    token,
                });
            } else {
                res.status(401).json({
                    message: 'log In failed',
                });
            }
        } else {
            res.status(401).json({
                message: 'Sign In failed',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: 'Sign In failed',
        });
    }
});

// GET ALL USERS
router.get('/allUser', async (req, res) => {
    try {
        const users = await User.find({
            name: 'vu',
        }).populate('todos', 'title description status -_id');

        res.status(200).json({
            message: 'User founded!',
            users,
        });
    } catch (err) {
        res.status(500).json({
            message: 'User not found!',
        });
    }
});

module.exports = router;
