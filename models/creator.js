const mongoose = require('../db/creator_db_connect.js');
const Schema = mongoose.Schema;
const Video = require('./video.js').schema;

const Creator = new Schema();

Creator.add({
    name: String,
    videos: [ Schema.Types.Mixed ],
    followers: [ Schema.Types.Mixed ],
    about: String,
    avatar: String,
    following: [ Schema.Types.Mixed ],
    email: String,
    authID: Schema.Types.Mixed
});

module.exports = mongoose.model('creator', Creator);
