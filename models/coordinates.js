const mongoose = require("mongoose");

const DocterSchema = mongoose.Schema({
  name: String,
  l1: String,
  l2: String,
  reviews: [
    {
      type: String,
    },
  ],
});

const Docter = mongoose.model("Docter", DocterSchema);

module.exports = Docter;
