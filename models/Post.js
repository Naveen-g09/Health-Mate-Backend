const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  myFile: String,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
