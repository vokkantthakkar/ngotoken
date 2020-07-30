const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let err = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Email Field Validation
  if (validator.isEmpty(data.email)) {
    err.email = "Email field is required.";
  }
  if (!validator.isEmail(data.email)) {
    err.email = "Please enter a valid email.";
  }

  // Password Field Validation
  if (validator.isEmpty(data.password)) {
    err.password = "Password field is required.";
  }

  return {
    errors: err,
    isValid: isEmpty(err),
  };
};
