"use strict";

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');

// functions for plants

class Plant {

    // Find all plants.

    static async findAll(){
        let query = `SELECT common_name,
                            sci_name,
                            seed_specs,
                            transplant,
                            culture,
                            germination,
                            disease_pests AS "diseasePests",
                            harvest,
                            life_cycle AS "lifeCycle",
                            spacing,
                            height,
                            light_soil_requirements AS "lightSoilRequirements",
                            plant_use AS "plantUse",
                            growing_tips As "growingTips"
                    FROM plants`;
        const plantsRes = await db.query(query);
        return plantsRes.rows;
    }
}

module.exports = Plant;