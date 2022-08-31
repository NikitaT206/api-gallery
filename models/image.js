const mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
});

module.exports = new mongoose.model('Image', imageSchema);