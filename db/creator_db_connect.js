var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/creators')

module.exports = mongoose;
