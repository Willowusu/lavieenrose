const sanitize = require("mongo-sanitize");

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
