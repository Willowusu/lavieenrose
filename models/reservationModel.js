var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const reservationSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  roomInformation: {
    type: Object,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  daysBooked: {
    type: Number,
    required: true,
  },
  adults: {
    type: Number,
    required: true,
  },
  children: {
    type: Number,
    required: true,
  },
  dateBooked: {
    type: Date,
    required: true,
    default: Date.now,
  },
  code: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: mongoose.Decimal128,
    required: true,
  },
});

// Compile model from schema
module.exports = mongoose.model("Reservation", reservationSchema);
