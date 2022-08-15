var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Reservation = require("../models/reservationModel");
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
router.get("/rooms", function (req, res, next) {
  res.render("rooms", { title: "Express" });
});

/* Reservation endpoints */
router.get("/reservation", function (req, res, next) {
  res.render("reservation", { title: "Express" });
});

router.post("/reserve-room", async function (req, res, next) {
  var details = helper.deepSanitize(req.body);
  var code = randomstring.generate(7);
  //TODO: check if code is already in use
  //TODO: Show receipt like feature and amount to pay
  try {
    await Reservation.create({
      firstName: details.fname,
      lastName: details.lname,
      email: details.email,
      room: details.room,
      arrivalDate: details.arrivalDate,
      departureDate: details.arrivalDate,
      adults: details.adults,
      children: details.children,
      code: code,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error reserving room");
  }

  return res.status(200).send("Room reserved successfully")
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
