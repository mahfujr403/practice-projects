const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo',
        },
    ],
});

module.exports = userSchema;
