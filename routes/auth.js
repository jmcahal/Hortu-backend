"use strict";

// Routes for authentication logging in and logging out

const express = require("express");


const User = require('../models/user');
const passport = require("passport");
const router = new express.Router();
const db = require("../db");
const { checkNotAuthenticated } = require("../middleware/auth");

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', function(req, res){
    req.logOut();
    // users for now
    res.redirect('/users');
});

module.exports = router;