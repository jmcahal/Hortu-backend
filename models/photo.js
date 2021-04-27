"use strict";

const db = require('../db');

const { BadRequestError, NotFoundError } = require('../expressError');

class Photo {
    //  functions for photos.

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

}

module.exports = Photo;