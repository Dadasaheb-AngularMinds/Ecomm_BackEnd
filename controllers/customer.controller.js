const Customer = require('../models/customer.model');
const Org = require('../models/org.model');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// @desc Create new Customer
// @route POST /customers
// @access Private
const createNewCustomer = asyncHandler(async (req, res) => {
  const { username, password, roles, ...rest } = req.body;
  // Confirm data
  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // Check for duplicate username
  const duplicate = await Customer.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' });
  }
  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
  const customerObject = { username, password: hashedPwd, ...rest };
  // Create and store new Customer
  const customer = await Customer.create(customerObject);
  if (customer) {
    //created
    res
      .status(201)
      .json({ message: `New user ${username} created`, data: customer });
  } else {
    res.status(400).json({ message: 'Invalid user data received' });
  }
});


// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' })
  }

  const foundUser = await Customer.findOne({ username }).exec()

  if (!foundUser || !foundUser.active) {
      return res.status(401).json({ message: 'Unauthorized' })
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) return res.status(401).json({ message: 'Unauthorized' })

  const accessToken = jwt.sign(
      {
          "UserInfo": {
              "username": foundUser.username,
              "roles": foundUser.role
          }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
  )

  // Create secure cookie with refresh token 
  res.cookie('jwt', refreshToken, {
      httpOnly: true, //accessible only by web server 
      secure: true, //https
      sameSite: 'None', //cross-site cookie 
      maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
  })

  // Send accessToken containing username and roles 
  res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

  const refreshToken = cookies.jwt

  jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      asyncHandler(async (err, decoded) => {
          if (err) return res.status(403).json({ message: 'Forbidden' })

          const foundUser = await Customer.findOne({ username: decoded.username }).exec()

          if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

          const accessToken = jwt.sign(
              {
                  "UserInfo": {
                      "username": foundUser.username,
                      "roles": foundUser.role
                  }
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '15m' }
          )

          res.json({ accessToken })
      })
  )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Cookie cleared' })
}

// @desc Get all customers
// @route GET /customers 
// @access Private
const getAllCustomers = asyncHandler(async (req, res) => {
  // Get all customers from MongoDB
  const customers = await Customer.find().select('-password').lean();
  // If no customers
  if (!customers?.length) {
    return res.status(400).json({ message: 'No customers found' });
  }
  res.json(customers);
});

// @desc Update a Customer
// @route PATCH /customers
// @access Private
const updateCustomer = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res
      .status(400)
      .json({ message: 'All fields except password are required' });
  }
  // Does the Customer exist to update?
  const customer = await Customer.findById(id).exec();
  if (!customer) {
    return res.status(400).json({ message: 'Customer not found' });
  }
  // Check for duplicate
  const duplicate = await Customer.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }
  customer.username = username;
  customer.roles = roles;
  customer.active = active;
  if (password) {
    // Hash password
    customer.password = await bcrypt.hash(password, 10); // salt rounds
  }
  const updatedCustomer = await customer.save();
  res.json({ message: `${updatedCustomer.username} updated` });
});

// @desc Delete a Customer
// @route DELETE /customers
// @access Private
const deleteCustomer = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Customer ID Required' });
  }
  // Does the customer still have assigned notes?
  const note = await Customer.findOne({ customer: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: 'Customer has assigned notes' });
  }
  // Does the customer exist to delete?
  const customer = await Customer.findById(id).exec();
  if (!customer) {
    return res.status(400).json({ message: 'Customer not found' });
  }
  const result = await customer.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
});


module.exports = {
  login,
  refresh,
  logout,
  getAllCustomers,
  createNewCustomer,
  updateCustomer,
  deleteCustomer,
}
