const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("Quote", quoteSchema);
