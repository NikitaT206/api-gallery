const mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  exif: {
    type: Object
  }
});

module.exports = new mongoose.model('Image', imageSchema);