const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Creator = require('../models/creator');
const Video = require('../models/video');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    let creatorPromise;

    if(req.user){
        creatorPromise = Creator.find({ "name" : req.user.username }).exec();
    }
    
    let videoPromise = Video.find({}).sort({'_id' : -1}).limit(10).exec();

    // If the user is logged in, display their information on the main page 
    // after querying the database.
    if(creatorPromise !== undefined) {
        creatorPromise.then( creatorResult => {
           let creator = creatorResult;
           videoPromise.then(videos => {
                return res.render('index', { user : req.user, creator : creator, videos : videos });   
           });
        });
    } else {
        videoPromise.then(videos => {
            return res.render('index', { videos : videos });   
        });
    }
});

router.get('/v/:id', (req, res) => {
    Video.find({"_id" : req.params.id}, (err, video, data) => {
        if(err) return res.send("Error looking in video DB");
        Creator.find({ "_id" : video[0].creatorIDs[0] }, (err, data) => {
            if(err) return res.send("Error looking in creator DB");
            return res.render('video', { video : video[0], creator : data[0] });
        })
    });
});

router.get('/:username', (req, res) => {
    Creator.find({"name" : req.params.username }, (err, data, length) => {
        if(!data[0]) return res.send("User doesn't exist.");
        
        let userVideoPromises = [];

        data[0].videos.forEach( video => {
            userVideoPromises.push( Video.find( {"_id" : video } ).lean().exec() );
        });

        Promise.all(userVideoPromises).then( user_videos => {
            return res.render('user', { user: data[0], user_videos: user_videos });
        });
    });
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    // Have to do a manual check on the Creator DB, as it's not the same as the AUTH DB.
    if(!req.body.email) return res.render('register', { error : "You need to put an Email to use."})
    Creator.find({'email' : req.body.email}, (err, data, length) => {
        if(err) console.log(err);
        if(data[0]) {
            return res.render('register', { error : "Email already in use."});
        } else {
            Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
                if (err) return res.render('register', { error : err.message });

                let newCreator = new Creator({ name: req.body.username, about: "Hello, I'm a new user who hasn't edited their about section!", email : req.body.email, authAccountID: account._id});
                console.log("authAccountID: " + account._id);
                newCreator.save( err => {
                  if (err) return res.render('register', { error : err.message });
                });

                // Registration is complete, authenticate the user.

                passport.authenticate('local')(req, res, () => {
                    req.session.save((err) => {
                        if (err) return next(err);
                        res.redirect('/');
                    });
                });
            });
        }
    });

});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
