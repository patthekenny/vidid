const mongoose = require('../db/video_db_connect.js');
const Schema = mongoose.Schema;
const Creator = require('./creator.js').schema;

const Video = new Schema({
    title: String,
    video_location: String,
    views: Number,
    likes: Number,
    dislikes: Number,
    comments: [ Schema.Types.Mixed ],
    description: String,
    creatorIDs: [ Schema.Types.Mixed ],
    thumbnail: String
});

module.exports = mongoose.model('video', Video);
