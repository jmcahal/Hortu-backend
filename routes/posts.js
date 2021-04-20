"use strict";

// Routes for post

const express = require("express");

const { BadRequestError } = require("../expressError");
const Post = require('../models/post');

const router = new express.Router();

// GET / => {posts: [{common_name, sci_name, etc},..]}

router.get("/", async function (req, res, next) {
    const q = req.query;
    try {
        const posts = await Post.findAll(q);
        return res.json({ posts });

    }catch (err) {
        return next(err);
    }
});

module.exports = router;