const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");

// REGISTER
const register = async (req, res) => {

  const user = await User.create({ ...req.body });
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user: {name: user.name} , token });
};

// LOGIN
const login = async (req, res) => {
  const {email, password} = req.body

  // ERROR IF NO EMAIL/PASSWORD
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }

  const user = await User.findOne({email})
  // compare password
  if (!user) {
    throw new UnauthenticatedError("User Not Found")
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Password")
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({user: {name: user.name}, token})

};

module.exports = {
  register,
  login,
};
