const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

schema.virtual("bookCount").get(function () {
  return this.bookCount || 0;
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model("Author", schema);
