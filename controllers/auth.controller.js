const User = require('../models/user.model');
const Org = require('../models/org.model');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const userService = require('../services/user.service');
const Organization = require('../models/org.model');
const { authService } = require('../services');

// @desc Login
// @route POST /auth
// @access Public
const register = asyncHandler(async (req, res) => {
  const { username, password, email, role, ...rest } = req.body;
  // Confirm data
  if (!username || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'Bad Request',
      code: httpStatus.BAD_REQUEST,
      message: 'All fields are required',
    });
  }
  // Check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(httpStatus.CONFLICT).json({
      error: 'Bad Request',
      code: httpStatus.CONFLICT,
      message: 'Duplicate username',
    });
  }
  const hashedPwd = await bcrypt.hash(password, 10);
  try {
    const org = await Organization.create(req.body);
    const userObject = {
      username,
      password: hashedPwd,
      _org: org._id,
      email,
      ...rest,
    };
    let user;
    user = await User.create(userObject);
    console.log(user);
    if (user) {
      return res.status(201).json({
        result: { message: `New user ${username} created`, user: user },
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(httpStatus.CONFLICT).json({
        error: 'Bad Request',
        code: httpStatus.CONFLICT,
        message: 'User already exists with this e-mail',
      });
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'INTERNAL_SERVER_ERROR',
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
});

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'Bad Request',
      code: httpStatus.BAD_REQUEST,
      message: 'All fields are required',
    });
  }
  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || foundUser.role !== 'admin') {
    return res.status(httpStatus.NOT_FOUND).json({
      error: 'Not Found',
      code: httpStatus.NOT_FOUND,
      message: 'User not found',
    });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match)
    return res.status(httpStatus.UNAUTHORIZED).json({
      error: 'Unauthorized',
      code: httpStatus.UNAUTHORIZED,
      message: 'Incorrect username or password',
    });
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'None', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });
  // Send accessToken containing username and roles
  res.status(200).json({ token: accessToken, user: foundUser });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
