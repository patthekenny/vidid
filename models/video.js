const mongoose = require('./db/video_db_connect.js');
const Schema = mongoose.Schema;

const Video = new Schema({
    title: String,
    video_location: String,
    likes: Number,
    dislikes: Number,
    comments: [ String ],
    creator: Creator
});

module.exports = mongoose.model('video', Video);
