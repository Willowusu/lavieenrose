var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  images: {
    type: Object,
  }
});

// Compile model from schema
module.exports = mongoose.model("Room", roomSchema);
