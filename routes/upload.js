const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Creator = require('../models/creator');
const Video = require("../models/video");
const router = express.Router();
const path = require('path');
const allowedExts = require('./allowed_exts');
const randomstring = require('randomstring');
var mongoose = require('mongoose');

// These are all from /upload.

router.get('/', (req, res) => {
    res.status(400).send('400 - Bad Request - Use main page to upload instead(API coming soon...)');
});

router.post('/', (req, res) => {
    if(!req.files.video) return res.status(400).send('400 - Bad Request - No files were uploaded.');
    if(!req.user) return res.status(401).send('401 - Unauthorized - Log in on the main page.');
    let file = req.files.video;

    if(file) {
        let ext = path.extname(file.name);

        console.log("NAMES + EXT: ", ext.toLowerCase(), file.name);
        console.log(allowedExts);

        if(!allowedExts.includes(ext.toLowerCase())) return res.send(`ERROR: only the following file extensions are allowed: ${allowedExts}`);

        // Abandon hope, all ye who enter here. There be spaghetti abound.

        let videoFileNameNoExt = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        });

        let fullFileName = videoFileNameNoExt + ext;

        console.log(`fullFileName: ${fullFileName}`);

        file.mv(`public/videostore/${fullFileName}`, err => {
            if(err) res.status(500).send(err);

            Creator.find({ "name" : req.user.username }, (err, data, length) => {
                if(err) return res.status(500).send("We messed up somewhere. I'm sure we'll figure it out soon.");

                let newVideo = new Video({ title : req.body.title == undefined ? "Untitled" : req.body.title, video_location : `${fullFileName}`, creatorIDs: data[0]._id, views: 1, likes: 0, dislikes: 0, description: "I haven't added this feature yet!", thumbnail: "http://i.imgur.com/uZxUpkm.png"});

                newVideo.save((err, video, length) => {
                    if(err) res.status(500).send("Saving video into DB failed..");
                    let vidID = video._id;
                    Creator.update({ "name" : req.user.username }, { $push : { 'videos' : vidID }}, { upsert : true }, (err, data) => {
                        if(err) res.status(500).send("Creator DB saving failed.");
                        return res.redirect(`/v/${vidID}`);
                    });
                });
            });
        });
    } else {
        return res.status(400).send("You need to put a file in the upload box!");
    }


});

module.exports = router;
