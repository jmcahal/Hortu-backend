"use strict";

const db = require('../db');

const { BadRequestError, NotFoundError } = require('../expressError');
const {sqlForPartialUpdate} = require('../helpers/sql');

class Photo {
    //  functions for photos.

    // To get all photos.

    static async findAll() {
        let query = `SELECT  ph.title,
                             ph.description,
                             ph.img,
                             ph.username,
                             ph.plant_id,
                             ph.post_id
                    FROM photos ph
                    LEFT JOIN posts AS p ON p.id = ph.post_id`

        const photosRes = await db.query(query);
        return photosRes.rows;
    }

    // Find a photo based its post. 
    // check for syntax

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

    // Find a photo based its id. 

    // static async get(id) {
    //     const photoRes = await db.query (`SELECT id,
    //                     title,
    //                     description,
    //                     img,
    //                     username,
    //                     plant_id AS "plantId",
    //                     post_id AS "postId"
    //                 FROM photos
    //                 WHERE id = $1`,
    //                 [id]);
    //     const photo = photoRes.rows[0];

    //     if (!photo) throw new NotFoundError(`No photo with the id: ${id}`)

    //     return photo;
    // };

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