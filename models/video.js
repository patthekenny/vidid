const mongoose = require('./db/video_db_connect.js');
const Schema = mongoose.Schema;
const Creator = require('./creator.js').schema;

const Video = new Schema({
    title: String,
    video_location: String,
    views: Number,
    likes: Number,
    dislikes: Number,
    comments: [ String ],
    description: String,
    creator: [ Creator ]
});

module.exports = mongoose.model('video', Video);
