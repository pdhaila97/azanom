const { isEmpty } = require("lodash");

function checkPasswordValidity(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+-=[\]{};':"\|,.<>?]/.test(password);
  const minLength = 8;

  const errorMessages = {
    upperCase: "Does not contain an upper case alphabet.",
    lowerCase: "Does not contain a lower case alphabet.",
    number: "Does not contain a number.",
    symbol: "Does not contain any special character.",
    length: `Has length shorter than ${minLength}.`,
  };

  let errors = [];

  if (!hasUppercase) {
    errors.push(errorMessages.upperCase);
  }
  if (!hasLowercase) {
    errors.push(errorMessages.lowerCase);
  }
  if (!hasNumber) {
    errors.push(errorMessages.number);
  }
  if (!hasSymbol) {
    errors.push(errorMessages.symbol);
  }
  if (password.length < minLength) {
    errors.push(errorMessages.length);
  }

  if (!isEmpty(errors)) {
    errors.unshift('Password Validation Failed!\n')
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  checkPasswordValidity,
};
