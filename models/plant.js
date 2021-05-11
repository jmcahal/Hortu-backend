"use strict";

const db = require('../db');
const { sqlForPartialUpdate } = require("../helpers/sql");
const { BadRequestError, NotFoundError } = require('../expressError');

// functions for plants

class Plant {

    // Find all plants.

    static async findAll(){
        let query = `SELECT common_name AS "commonName",
                            sci_name AS "sciName",
                            seed_specs AS "seedSpecs",
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

    //  Find a plant given its id. 

    static async get(id) {
        const plantRes = await db.query (`SELECT id,
                        common_name,
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
                        growing_tips AS "growingTips"
                    FROM plants
                    WHERE id = $1`,
                    [id]);
        const plant = plantRes.rows[0];

        if (!plant) throw new NotFoundError(`No plant: ${id}`)

        const photoRes = await db.query (`SELECT id,
                        title,
                        description,
                        img,
                        username,
                        plant_id AS "plantId",
                        post_id AS "postId"
                    FROM photos
                    WHERE plant_id = $1`,
                    [id]);
        plant.photos = photoRes.rows;

        return plant;
    }

    // Update a plant given its id.

    static async update(id,data) {

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                seedSpecs: "seed_specs",
                transplant: "transplant",
                culture: "culture",
                germination: "germination",
                diseasePests: "disease_pests",
                harvest: "harvest",
                lifeCycle: "life_cycle",
                spacing: "spacing",
                height: "height",
                lightSoilRequirements: "light_soil_requirements",
                plantUse: "plant_use",
                growingTips: "growing_tips"
            }
        );
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE plants
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING common_name AS "commonName",
                                        sci_name AS "sciName",
                                        seed_specs AS "seed_specs",
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
                                        growing_tips AS "growingTips"`;
        const result = await db.query(querySql, [...values, id]);
        console.log(result);
        const plant = result.rows[0];

        return plant;

    }

    // Create a plant.

    static async create({
                        commonName,
                        sciName,
                        seedSpecs,
                        transplant,
                        culture,
                        germination,
                        diseasePests,
                        harvest,
                        lifeCycle,
                        spacing,
                        height,
                        lightSoilRequirements,
                        plantUse,
                        growingTips 
                    }) {
        const checkForDuplicate = await db.query(
            `SELECT sci_name AS "sciName"
            FROM plants
            WHERE sci_name = $1`,
            [sciName]
        );
        if (checkForDuplicate.rows[0]) throw new BadRequestError(`Duplicate plant: ${sciName}`);
        
        const result = await db.query(
            `INSERT INTO plants
            (common_name, sci_name, seed_specs, transplant,
                culture, germination, disease_pests, harvest,
                life_cycle, spacing, height, light_soil_requirements,
                plant_use, growing_tips)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING common_name AS "commonName",
                sci_name AS "sciName",
                seed_specs AS "seedSpecs", 
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
                growing_tips AS "growingTips"`,
                [
                    commonName,
                    sciName,
                    seedSpecs,
                    transplant,
                    culture,
                    germination,
                    diseasePests,
                    harvest,
                    lifeCycle,
                    spacing,
                    height,
                    lightSoilRequirements,
                    plantUse,
                    growingTips 
                ]
        );
        const plant = result.rows[0];

        return plant;    
    }

    static async delete(id) {
        const result = await db.query(
            `DELETE FROM plants
            WHERE id = $1
            RETURNING common_name`,
            [id]
        );
        const plant = result.rows[0];

        if (!plant) throw new NotFoundError (`No plant with id: ${id}`);
    };
}

module.exports = Plant;