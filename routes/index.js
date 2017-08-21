const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Creator = require('../models/creator');
const Video = require('../models/video');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    console.log(req.body);
    if(!req.user) return res.render('index', { user : req.user});
    Creator.find({ "name" : req.user.username }, (err, data) => {
      if(err) console.log(err);
      return res.render('index', { user : req.user, creator : data[0] });
    });
    /*
    Creator.update({ "name" : req.user.username }, { $push : {'followers' : 1}}, {upsert : true }, (err, data) => {
      if(err) console.log(err);
      console.log(data);
    });
    */
});

router.get('/v/:id', (req, res) => {
    Video.find({"_id" : req.params.id}, (err, video, data) => {
        if(err) return res.send("Error looking in video DB");
        return res.render('video', { video : video[0] });
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
        console.log(data);
        if(data.email) {
            return res.render('register', { error : "Email already in use."});
        } else {
            Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
                if (err) return res.render('register', { error : err.message });

                let newCreator = new Creator({ name: req.body.username, about: "Hello, I'm a new user who hasn't edited their about section!", email : req.body.email, authAccountID: account._id});

                newCreator.save( err => {
                  if (err) return res.render('register', { error : err.message });
                });

                // Registration is complete, authenticate the user.

                passport.authenticate('local')(req, res, () => {
                    req.session.save((err) => {
                        if (err) {
                            return next(err);
                        }
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
