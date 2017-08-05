var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/video_data')

module.exports = mongoose;
