const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    quote: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Quote",
    },
});

module.exports = mongoose.model("Like", likeSchema);
