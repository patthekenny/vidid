const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();
var mongoose = require('mongoose');

router.get('/', (req, res) => {
    res.status(400).send('400 - Bad Request - Use main page to upload instead(API coming soon...)');
});

router.post('/', (req, res) => {
    if(!req.files.video) return res.status(400).send('400 - Bad Request - No files were uploaded.');
    if(!req.user) return res.status(401).send('401 - Unauthorized - Log in on the main page.');

    console.log(Object.keys(req.files.video));
    console.log(`FILE PROPERTIES: \nNAME:${ req.files.video.name }\nENCODING:${ req.files.video.encoding }\nMIMETYPE:${ req.files.video.name }`);
    console.log(`USER: ${ req.user }`);
    let file = req.files.video;

    return res.send("didey!");
});

module.exports = router;
