const mongoose = require('./db/creator_db_connect.js');
const Schema = mongoose.Schema;
const Video = require('./video.js').schema;

const Creator = new Schema({
    name: String,
    videos: [ Video ],
    followers: [ this ]
    about: String,
    avatar: String 
});

module.exports = mongoose.model('creator', Creator);
