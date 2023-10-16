const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your API credentials
cloudinary.config({
  cloud_name: 'dn3dqbsfd',
  api_key: '931557133227187',
  api_secret: '3fk5t_uN5lXsq_TUGIJuCMnXGJw',
});

module.exports = cloudinary;
