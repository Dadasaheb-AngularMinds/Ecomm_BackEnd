const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: String,  
  mimeType: String,  
  size: Number,  
  data: Buffer,  
  url:String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
