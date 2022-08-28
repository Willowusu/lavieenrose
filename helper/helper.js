const sanitize = require("mongo-sanitize");

/* A recursive function that sanitizes all the elements in an object. */
exports.deepSanitize = function (object) {
  if (Array.isArray(object)) {
    object.forEach((element) => module.exports.deepSanitize(element));
  }
  if (object && typeof object === "object") {
    Object.values(object).forEach((element) => {
      module.exports.deepSanitize(element);
    });
  }
  return sanitize(object);
};

/* Converting a date string to an ISO date string. */
exports.covertToIsoDate = function (dateStr) {
  const date = new Date(dateStr);
  const iso = date.toISOString();
  return iso;
};


