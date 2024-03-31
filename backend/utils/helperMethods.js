const { isEmpty, forEach } = require("lodash");
const sanitize = require("mongo-sanitize");

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
    errors.unshift("Password Validation Failed!\n");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

const checkPasswordValidity2 = (password) => {
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
    errors.unshift("\n");
    throw new Error(errors.join("\n"));
  }

  return password;
};

const getSanitizedParams = (obj, keys) => {
  const res = {};
  forEach(keys, key => {
    res[key] = sanitize(obj[key]);
  });

  return res;
}

const calculateRelativeTime = (timeInMilliseconds) => {
  if (timeInMilliseconds < 0) {
    throw new Error("Time cannot be negative");
  }

  // Convert milliseconds to seconds
  const timeInSeconds = timeInMilliseconds / 1000;

  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
}


const validUserTypes = ['buyer', 'seller'];

module.exports = {
  checkPasswordValidity,
  checkPasswordValidity2,
  getSanitizedParams,
  calculateRelativeTime,
  validUserTypes
};
