const mongoose = require('./db/creator_db_connect.js');
const Schema = mongoose.Schema;
const Video = require('./video.js');

const Creator = new Schema({
    name: String,
    videos: [ Video ],
    
});

module.exports = mongoose.model('creator', Creator);
