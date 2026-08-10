const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (
    !firstName ||
    !lastName ||
    typeof firstName !== "string" ||
    typeof lastName !== "string"
  ) {
    throw new Error("Name is not valid!");
  }

  if (!validator.isEmail(emailId || "")) {
    throw new Error("Email is not valid!");
  }

  if (!validator.isStrongPassword(password || "")) {
    throw new Error("Please enter a strong password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const bodyKeys = Object.keys(req.body);
  if (bodyKeys.length === 0) {
    throw new Error("No profile fields provided.");
  }

  const isEditAllowed = bodyKeys.every((field) =>
    allowedEditFields.includes(field),
  );

  if (!isEditAllowed) {
    throw new Error("Invalid profile fields provided.");
  }

  const { firstName, lastName, emailId, photoUrl, gender, age, skills } =
    req.body;

  if (firstName !== undefined && typeof firstName !== "string") {
    throw new Error("First name must be a string.");
  }

  if (lastName !== undefined && typeof lastName !== "string") {
    throw new Error("Last name must be a string.");
  }

  if (emailId !== undefined && !validator.isEmail(emailId)) {
    throw new Error("Email is not valid.");
  }

  if (photoUrl !== undefined && !validator.isURL(photoUrl)) {
    throw new Error("Photo URL is not valid.");
  }

  if (gender !== undefined && !["male", "female", "other"].includes(gender)) {
    throw new Error("Gender is not valid.");
  }

  if (age !== undefined) {
    const numericAge = Number(age);
    if (!Number.isInteger(numericAge) || numericAge < 18) {
      throw new Error("Age must be an integer and at least 18.");
    }
    req.body.age = numericAge;
  }

  if (skills !== undefined) {
    if (
      !Array.isArray(skills) ||
      !skills.every((item) => typeof item === "string")
    ) {
      throw new Error("Skills must be an array of strings.");
    }
  }

  return true;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
