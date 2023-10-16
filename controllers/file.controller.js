// routes/files.js
const File = require('../models/file.model');
const cloudinary = require('../config/cloudinary-config');

const uploadFile = async (req, res) => {

  try {
    const fileBuffer = req.file.buffer; // File data in memory
     cloudinary.uploader
      .upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: 'Upload to Cloudinary failed' });
        }
        const publicUrl = result.secure_url;
        console.log(result.secure_url);
        const { originalname, mimetype, buffer, size } = req.file;
        // const uploadedBy = req.user.id;
        const file = new File({
          originalName: originalname,
          mimeType: mimetype,
          size,
        //   data: buffer,
          url: result.secure_url,
          //   uploadedBy,
        });
        file.save();
        res.status(201).send(file );
      })
      .end(fileBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadFile,
};
