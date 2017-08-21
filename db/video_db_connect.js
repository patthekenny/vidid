var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/videos')

module.exports = mongoose;
