"use strict";

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');

//  functions for posts

class Post {

    // Find all posts.

    static async findAll(){
        let query = `SELECT title,
                            post_body AS "postBody",
                            username,
                            plant_id
                    FROM posts
                    ORDER BY username`;
        const postsRes = await db.query(query);
        return postsRes.rows;
    }
}

module.exports = Post;