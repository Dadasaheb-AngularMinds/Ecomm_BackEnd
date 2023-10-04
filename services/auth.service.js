const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Customer = require('../models/customer.model');


/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (username, password) => {
  const user = await Customer.findOne({ username }).exec();

//   if (!user || user.deleted || !(await user.isPasswordMatch(password))) {
//     throw new ApiError(
//       httpStatus.UNAUTHORIZED,
//       'Incorrect username or password'
//     );
//   }
  //   return await user.populate([
  //     { path: '_org', select: 'name logo customDomain address phone' },
  //     { path: 'profilePicture', select: 'name link' },
  //   ]);
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
