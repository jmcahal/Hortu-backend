"use strict";

// Routes for users

const express = require("express");

const { BadRequestError } = require("../expressError");
const User = require('../models/user');

const router = new express.Router();

// GET / => {users: [{username, password, first_name, etc.},..]}

router.get("/", async function (req, res, next) {
    const q = req.query;
    try {
        const users = await User.findAll(q);
        return res.json({ users });

    }catch (err) {
        return next(err);
    }
});

// GET/username => {[username], firstName, lastName, isAdmin}
router.get("/:username", async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({user});
    } catch (err) {
        return next(err);
    }
});

// PATCH/[username] { user } => { user }
// data may include: { firstName, lastName, password, email }
//  returns {username, firstName, lastName, isAdmin}
router.patch("/:username", async function (req, res, next) {
    try {
        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch(err) {
        return next(err);
    }
});

// POST/ {user} => {user,token}
//  Adds a new user.

router.post("/", async function (req, res, next) {
    try {
        const user = await User.register(req.body);
        // const token = createToken(user);
        return res.status(201).json({ user });
    } catch (err) {
        return next(err);
    }
});

// DELETE/[username] => {username}

router.delete("/:username", async function (req, res, next) {
    try {
        await User.delete(req.params.username);
        return res.json({deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;