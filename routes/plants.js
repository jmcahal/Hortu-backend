"use strict";

// Routes for plants

const express = require("express");

const { BadRequestError } = require("../expressError");
const Plant = require('../models/plant');

const router = new express.Router();

// GET / => {plants: [{common_name, sci_name, etc},..]}

router.get("/", async function (req, res, next) {
    const q = req.query;
    try {
        const plants = await Plant.findAll(q);
        return res.json({ plants });

    }catch (err) {
        return next(err);
    }
});

module.exports = router;