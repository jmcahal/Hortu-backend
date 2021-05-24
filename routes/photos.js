"use strict";

// Routes for photo

const express = require("express");

const { BadRequestError } = require("../expressError");
const { checkAuthenticated } = require("../middleware/auth");
const Photo = require('../models/photo');

const router = new express.Router();

// GET / => {photos: [{title, description, img},..]}

router.get("/", async function (req, res, next) {
    const q = req.query;
    try {
        const photos = await Photo.findAll(q);
        return res.json({ photos });

    }catch (err) {
        return next(err);
    }
});

// GET/photoId => {photo: [{title, description, img},..]}

router.get("/:postId", async function (req, res, next) {
    try {
        const photos = await Photo.get(req.params.postId);
        return res.json({ photos });

    }catch (err) {
        return next(err);
    }
});

// PATCH /[id] => {data} => Return {id, title, description, img, etc...}

router.patch("/:id", async function (req, res, next) {
    try {
        const photo = await Photo.update(req.params.id, req.body);
        return res.json({ photo });

    }catch (err) {
        return next(err);
    }
});

// POST/ => {data} => Return {id, title, description, img, etc...}

router.post("/", async function (req, res, next) {
    try {
        const photo = await Photo.create(req.body);
        return res.status(201).json({ photo });

    }catch (err) {
        return next(err); 
    }
});

// DELETE/[id]=>{title}

router.delete("/:id", async function (req, res, next) {
    try {
        await Photo.delete(req.params.id);
        return res.json({deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;