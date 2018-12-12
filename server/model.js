const mongoose = require('mongoose');
const schema = mongoose.Schema;

const todoSchema = new schema({
    text: String,
    completed: Boolean
});

module.exports = mongoose.model('Model', todoSchema);