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
                            plant_id AS "plantId",
                            journal_id AS "journalId"
                    FROM posts`;
        const postsRes = await db.query(query);
        return postsRes.rows;
    }

    // Find a post given its journal id.

    static async get(journalId) {
        const postRes = await db.query (`SELECT id,
                        username,
                        plant_id AS "plantId",
                        journal_id AS "journalId",
                        title,
                        post_body AS "postBody"
                    FROM posts
                    WHERE journal_id = $1`,
                    [journalId]);
        const posts = postRes.rows;

        if (!posts) throw new NotFoundError(`No posts with the journal id: ${journalId}`)

        // const photoRes = await db.query (`SELECT id,
        //                 title,
        //                 description,
        //                 img,
        //                 username,
        //                 plant_id AS "plantId",
        //                 post_id AS "postId"
        //             FROM photos
        //             WHERE post_id = $1`,
        //             [id]);
        // post.photos = photoRes.rows;

        return posts;
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
                                journal_id AS "journalId",
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
        journalId,
        plantId,
        title,
        postBody}) {

        const result = await db.query(
        `INSERT INTO posts
        (username, 
            plant_id,
            journal_id, 
            title, 
            post_body)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING id, username, 
            plant_id AS "plantId",
            journal_id AS "journalId",
            title, 
            post_body AS "postBody"`,
        [
            username,
            plantId,
            journalId,
            title,
            postBody
        ]
        );
        const post = result.rows[0];

        return post;    
    };

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