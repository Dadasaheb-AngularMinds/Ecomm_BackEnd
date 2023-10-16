const { Organization } = require('../models/org.model');
const { User } = require('../models/user.model');
const httpStatus = require('http-status');

const createOrg = async (orgBody) => {
  console.log(orgBody);
  return Organization.create(orgBody);
};

const createUser = async (userBody) => {
  const email = { email: userBody.email };
  const user = await User.findOne(email);
  if (!user) {
    Object.assign(user, { ...userBody });
    await user.save();
    return user;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, `Email already exists`);
  }
  // return User.create(userBody);
};

const userService = {
  createUser,
  createOrg,
};

module.exports = userService;
