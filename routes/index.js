var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Reservation = require("../models/reservationModel"),
  Room = require("../models/roomModel");

var helper = require("../helper/helper");
const randomstring = require("randomstring");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET home page. */
router.get("/about", function (req, res, next) {
  res.render("about", { title: "Express" });
});

/* GET home page. */
router.get("/rooms", async function (req, res, next) {
  var rooms = await Room.find().lean();
  res.render("rooms", { room: rooms });
});

/* GET room information. */
router.get("/room", async function (req, res, next) {
  var id = helper.deepSanitize(req.query.id);
  var roomInfo = await Room.findOne({ _id: id }).lean();
  res.render("room-information", { room: roomInfo });
});

/* Reservation endpoints */
router.get("/reservation", async function (req, res, next) {
  var rooms = await Room.find().lean();
  res.render("reservation", { room: rooms });
});

router.post("/reserve-room", async function (req, res, next) {
  var details = helper.deepSanitize(req.body);
  var code = randomstring.generate(7);
  //TODO: check if code is already in use
  //TODO: Show receipt-like feature and amount to pay
  try {
    await Reservation.create({
      firstName: details.fname,
      lastName: details.lname,
      email: details.email,
      room: details.room,
      arrivalDate: details.arrivalDate,
      departureDate: details.departureDate,
      adults: details.adults,
      children: details.children,
      code: code,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error reserving room");
  }

  let reservationInfo = await Reservation.findOne({code: code}).lean();

  return res.status(200).render("receipt", { room: reservationInfo});
});

/* GET home page. */
router.get("/blog", function (req, res, next) {
  res.render("blog", { title: "Express" });
});

/* GET home page. */
router.get("/contact", function (req, res, next) {
  res.render("contact", { title: "Express" });
});

module.exports = router;
