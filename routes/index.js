var express = require("express");
var router = express.Router();
var moment = require("moment");
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
router.get("/all-rooms", async function (req, res, next) {
  var rooms = await Room.find().lean();
  res.render("rooms", { room: rooms });
});

/* GET room information. */
router.get("/room", async function (req, res, next) {
 /* Getting the room information from the database. */
  var id = helper.deepSanitize(req.query.id);
  try{
  var roomInfo = await Room.findOne({ _id: id }).lean();
  }catch(err){
    console.log("Error finding room:", err)
  }
  res.render("room-information", { room: roomInfo, roomLink: roomInfo.images.Image3d });
});

/* Reservation endpoints */
router.get("/reservation" , async function (req, res, next) {
  try{
/* Getting all the rooms from the database. */
  var rooms = await Room.find().lean();
  } catch(err){
    console.log("Error getting all rooms", error)
  }
  res.render("reservation", { room: rooms });
});

router.post("/reserve-room", async function (req, res, next) {
  var details = helper.deepSanitize(req.body);
/* Generating a random string of 7 characters. */
  var code = randomstring.generate(7);
  var totalPrice, daysBetweenLodge, roomInformation, roomPrice;
  //TODO: check if code is already in use
  //TODO: Show receipt-like feature and amount to pay

  // /* Getting the room information from the database. */
  roomInformation = await Room.findOne({ _id: details.room }).lean();
  roomPrice = Number(roomInformation.price);

  // /* Converting the date to a moment object. */
  var arrivalDate = moment(helper.covertToIsoDate(details.arrivalDate));
  var departureDate = moment(helper.covertToIsoDate(details.departureDate));

  /* Calculating the number of days between the check-in date and the check-out date. */

  daysBetweenLodge = departureDate.diff(arrivalDate, "days");
  /**
   * The function calculates the total price of the room based on the number of days between the
   * check-in and check-out dates
   * @param daysBetweenLodge - The number of days between the check-in date and the check-out date.
   * @returns The total price of the room.
   */
  function calculateTotalPrice(daysBetweenLodge) {
    if (daysBetweenLodge == 0) {
      totalPrice = roomPrice * 1;
    } else {
      totalPrice = roomPrice * daysBetweenLodge;
    }
    return totalPrice.toFixed(2);
  }
  //check if max capacity of room
  var adultGuests = details.adults;
  var childrenGuests = details.children;
  if ((Number(adultGuests) + Number(childrenGuests)) > roomInformation.guests) {
    return res
      .status(500)
      .send({
        status: "failed",
        message: "Guests booked are more than required number for room.",
      });
  } else if (adultGuests + childrenGuests <= 0) {
     return res.status(500).send({
       status: "failed",
       message: "Guests should be more than 0.",
     });
  }
/* Creating a reservation in the database. */
  try {
    await Reservation.create({
      firstName: details.fname,
      lastName: details.lname,
      email: details.email,
      room: details.room,
      roomInformation: roomInformation,
      arrivalDate: details.arrivalDate,
      departureDate: details.departureDate,
      adults: details.adults,
      children: details.children,
      code: code,
      totalPrice: calculateTotalPrice(daysBetweenLodge),
      daysBooked: daysBetweenLodge,
    });
  } catch (error) {
    console.log("Error reserving room:", error);
    return res.status(500).send({status: "failed", message:"Error reserving room"});
  }

 // let reservationInfo = await Reservation.findOne({ code: code }).lean();

  return res.status(200).send({status:"success", message: code});
});

/* GET home page. */
router.get("/blog", function (req, res, next) {
  res.render("blog", { title: "Express" });
});

/* GET home page. */
router.get("/contact", function (req, res, next) {
  res.render("contact", { title: "Express" });
});

/* GET receipt page. */
router.get("/receipt", async function (req, res, next) {
  var details = helper.deepSanitize(req.query);
  var code = details.code;
  var reservationInfo;
/* Trying to find a reservation with the code that was sent in the request. If it finds it, it renders
the receipt page with the reservation information. If it doesn't find it, it logs an error. */
  try{
   reservationInfo = await Reservation.findOne({ code: code }).lean();
  }catch(err){
    console.log("Error getting room", err)
  }

  return res.render("receipt", { room: reservationInfo });
});

module.exports = router;
