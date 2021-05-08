"use strict";

// Routes for journal

const express = require("express");

const { BadRequestError } = require("../expressError");
const { checkAuthenticated } = require("../middleware/auth");
const Journal = require("../models/journal");

const router = new express.Router();

router.get("/", async function (req, res, next) {
    const q = req.query;
    try {
        const journals = await Journal.findAll(q);
        return res.json({ journals });

    }catch (err) {
        return next(err);
    }
});

// GET / => {journals: [{title, description},..]}

router.get("/:username", async function (req, res, next) {
    try {
        const journals = await Journal.findUserJournals(req.params.username);
        return res.json({ journals });

    }catch (err) {
        return next(err);
    }
});
// GET /[id] => {title, description}

// router.get("/:id", async function (req, res, next) {
//     try {
//         const journal = await Journal.get(req.params.id);
//         return res.json({ journal });

//     }catch (err) {
//         return next(err);
//     }
// });

// PATCH /[id] => {data} => Return {common_name, sci_name, etc...}

router.patch("/:id", async function (req, res, next) {
    try {
        const journal = await Journal.update(req.params.id, req.body);
        return res.json({ journal });

    }catch (err) {
        return next(err);
    }
});

// POST/ => {data} => Return {common_name, sci_name, etc...}

router.post("/", async function (req, res, next) {
    try {
        const journal = await Journal.create(req.body);
        return res.status(201).json({ journal });

    }catch (err) {
        return next(err);
    }
});

// DELETE/[id]=>{common_name}

router.delete("/:id", async function (req, res, next) {
    try {
        await Journal.delete(req.params.id);
        return res.json({deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;