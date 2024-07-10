const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
});

todoSchema.methods = {
    findCompleted() {
        return mongoose.model('Todo').find({ status: 'completed' });
    },
};

module.exports = todoSchema;
