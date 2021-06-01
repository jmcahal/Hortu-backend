"use strict";

const db = require('../db');

const { BadRequestError, NotFoundError } = require('../expressError');
const {sqlForPartialUpdate} = require('../helpers/sql');

class Photo {
    //  functions for photos.

    // To get all photos.

    static async findPlantPhotos(plantId) {
        const photoRes = await db.query( `SELECT title,
                            description,
                            img,
                            username,
                            plant_id AS "plantId",
                            post_id As "postId" 
                    FROM photos
                    WHERE plant_id = $1`,
                    [plantId]);

        const photos = photoRes.rows;
        if (!photos) throw new NotFoundError(`No photos for post with id: ${postId}`)
        return photos;
    }

    // Find a photo based its post. 

    static async get(postId) {
        const photoRes = await db.query (`SELECT id,
                        title,
                        description,
                        img,
                        username,
                        plant_id AS "plantId",
                        post_id AS "postId"
                    FROM photos
                    WHERE post_id = $1
                    ORDER BY id`,
                    [postId]);
        const photos = photoRes.rows;

        if (!photos) throw new NotFoundError(`No photos for post with id: ${postId}`)

        return photos;
    };

    // Update a photo given its id.

    static async update(id,data) {

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                tite: "title",
                desciption: "description"
            }
        );
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE photos
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING 
                            id,
                            title,
                            description,
                            img,
                            username,
                            plant_id AS "plantId",
                            post_id AS "postId"`;
        const result = await db.query(querySql, [...values, id]);
        console.log(result);
        const photo = result.rows[0];

        return photo;

    };

    // Create a photo given the user's username.

    static async create({
        title,
        description,
        img,
        username,
        plantId,
        postId}) {

        const result = await db.query(
        `INSERT INTO photos
        (title, 
            description, 
            img, 
            username,
            plant_id,
            post_id)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id,
            title, 
            description,
            img, 
            username, 
            plant_id AS "plantId",
            post_id AS "postId"`,
        [
            title,
            description,
            img,
            username,
            plantId,
            postId
        ]
        );
        const photo = result.rows[0];

        return photo;    
    };

    // delete a photo given the photo's id. 

    static async delete(id) {
        const result = await db.query(
        `DELETE FROM photos
        WHERE id = $1
        RETURNING id`,
        [id]
        );
        const photo = result.rows[0];

        if (!photo) throw new NotFoundError (`No photo with id: ${photo}`);
    };

}

module.exports = Photo;