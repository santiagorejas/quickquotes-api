const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: String,
        required: true,
    },
    quote: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Quote",
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("Comment", commentSchema);
