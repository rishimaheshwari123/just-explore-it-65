const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);
