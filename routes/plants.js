"use strict";

// Routes for plants

const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, isAuthenticated, checkAuthenticated } = require("../middleware/auth");
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

// GET /[id] => {common_name, sci_name, etc...}

router.get("/:id", async function (req, res, next) {
    try {
        const plant = await Plant.get(req.params.id);
        return res.json({ plant });

    }catch (err) {
        return next(err);
    }
});

// PATCH /[id] => {data} => Return {common_name, sci_name, etc...}

router.patch("/:id", checkAuthenticated, async function (req, res, next) {
    try {
        const plant = await Plant.update(req.params.id, req.body);
        return res.json({ plant });

    }catch (err) {
        return next(err);
    }
});

// POST/ => {data} => Return {common_name, sci_name, etc...}

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const plant = await Plant.create(req.body);
        return res.status(201).json({ plant });

    }catch (err) {
        return next(err);
    }
});

// DELETE/[id]=>{common_name}

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        await Plant.delete(req.params.id);
        return res.json({deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;