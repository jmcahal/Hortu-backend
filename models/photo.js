"use strict";

const db = require('../db');

const { BadRequestError, NotFoundError } = require('../expressError');

class Photo {
    //  functions for photos.

    static async findAll() {
        let query = `SELECT title,
                            description,
                            img,
                            username,
                            plant_id,
                            post_id
                    FROM photos`

        const photosRes = await db.query(query);
        return photosRes.rows;
    }

}

module.exports = Photo;