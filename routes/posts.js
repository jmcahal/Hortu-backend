"use strict";

// Routes for post

const express = require("express");

const { BadRequestError } = require("../expressError");
const { checkAuthenticated } = require("../middleware/auth");
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
// GET /[id] => {common_name, sci_name, etc...}

router.get("/:id", checkAuthenticated, async function (req, res, next) {
    try {
        const post = await Post.get(req.params.id);
        return res.json({ post });

    }catch (err) {
        return next(err);
    }
});

// PATCH /[id] => {data} => Return {common_name, sci_name, etc...}

router.patch("/:id", checkAuthenticated, async function (req, res, next) {
    try {
        const post = await Post.update(req.params.id, req.body);
        return res.json({ post });

    }catch (err) {
        return next(err);
    }
});

// POST/ => {data} => Return {common_name, sci_name, etc...}

router.post("/", checkAuthenticated, async function (req, res, next) {
    try {
        const post = await Post.create(req.body);
        return res.status(201).json({ post });

    }catch (err) {
        return next(err);
    }
});

// DELETE/[id]=>{common_name}

router.delete("/:id", checkAuthenticated, async function (req, res, next) {
    try {
        await Post.delete(req.params.id);
        return res.json({deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;