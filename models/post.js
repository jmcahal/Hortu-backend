"use strict";

const db = require('../db');
const { sqlForPartialUpdate } = require("../helpers/sql");
const { BadRequestError, NotFoundError } = require('../expressError');

//  functions for posts

class Post {

    // Find all posts.

    static async findAll(){
        let query = `SELECT id, title,
                            post_body AS "postBody",
                            username,
                            plant_id AS "plantId"
                    FROM posts
                    LEFT JOIN `;
        const postsRes = await db.query(query);
        return postsRes.rows;
    }

    // Find a post given its id.

    static async get(id) {
        const postRes = await db.query (`SELECT id,
                        username,
                        plant_id AS "plantId",
                        title,
                        post_body AS "postBody"
                    FROM posts
                    WHERE id = $1`,
                    [id]);
        const post = postRes.rows[0];

        if (!post) throw new NotFoundError(`No post with the id: ${id}`)

        return post;
    };

    // Update a post given its id.

    static async update(id,data) {

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                tite: "title",
                postBody: "post_body"
            }
        );
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE posts
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING username,
                                plant_id AS "plantId",
                                title,
                                post_body AS "postBody"`;
        const result = await db.query(querySql, [...values, id]);
        console.log(result);
        const post = result.rows[0];

        return post;

    };

    // Create a post.

    static async create({
        username,
        plantId,
        title,
        postBody}) {

        const result = await db.query(
        `INSERT INTO posts
        (username, 
            plant_id, 
            title, 
            post_body)
        VALUES ($1,$2,$3,$4)
        RETURNING username, 
            plant_id AS "plantId", 
            title, 
            post_body AS "postBody"`,
        [
            username,
            plantId,
            title,
            postBody
        ]
        );
        const post = result.rows[0];

        return post;    
        }

        static async delete(id) {
        const result = await db.query(
        `DELETE FROM posts
        WHERE id = $1
        RETURNING id`,
        [id]
        );
        const post = result.rows[0];

        if (!post) throw new NotFoundError (`No post with id: ${id}`);
        };

}

module.exports = Post; 