"use strict";

// Routes for photo

const express = require("express");

const { BadRequestError } = require("../expressError");
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

module.exports = router;