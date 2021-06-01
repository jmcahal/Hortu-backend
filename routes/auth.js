"use strict";

// Routes for authentication logging in and logging out

const express = require("express");


// const User = require('../models/user');
const passport = require("passport");
const router = new express.Router();
// const db = require("../db");

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});

module.exports = router;