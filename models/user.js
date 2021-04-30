"use strict";

const db = require('../db');
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { 
    BadRequestError, 
    NotFoundError,
    UnauthorizedError
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require("../config.js");

// functions for users

class User {

    // Find all users.
    //  Returns [{username, first_name, last_name, email, is_admin}, ...]

    static async findAll() {
        const result = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
            FROM users
            ORDER BY username`
        );

        return result.rows;
    }
    // find all info on a single user
    static async get(username) {
        try {
        const result = await db.query(
            `SELECT id, username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = result.rows[0]

        // if (!user) throw new NotFoundError(`No user: ${username}`);

        const photoRes = await db.query (`SELECT id,
                        title,
                        description,
                        img,
                        username,
                        plant_id AS "plantId",
                        post_id AS "postId"
                    FROM photos
                    WHERE username = $1
                    ORDER BY id`,
                    [username]);

        user.photos = photoRes.rows;

        const postRes = await db.query (`SELECT id,
                        username,
                        plant_id AS "plantId",
                        title,
                        post_body AS "postBody"
                    FROM posts
                    WHERE username = $1`,
                    [username]);
        user.posts = postRes.rows;
        
        return user;
        } catch(e) { return e; }

    }

    // Authenticate User
    static async authenticate(username, password) {
       try{
        // try to find the user first
        const result = await db.query(
            `SELECT username,
                password,
                is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                // delete user.password;
                return user;
            }
        }
        }catch(err){
            // throw new UnauthorizedError("Invalid username/password");
            return err;
        }
        
    }

    // find all info on a single user
    static async getInfo(username) {
        try {
        const result = await db.query(
            `SELECT username,
                    password,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username]
        );
        const user = result.rows[0];
        return user;
        } catch(e){
            return e;
        }
    }

    static async update(username,data) {

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
                email: "email",
                isAdmin: "is_admin"
            }
        );
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
                            SET ${setCols}
                            WHERE username = ${usernameVarIdx}
                            RETURNING username,
                                        first_name AS "firstName",
                                        last_name AS "lastName",
                                        email,
                                        is_admin AS "isAdmin"`;
        const result = await db.query(querySql, [...values, username]);
        console.log(result);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;

    }

    static async register({username, password, firstName, lastName, email, isAdmin}) {
        const checkForDuplicate = await db.query(
            `SELECT username
            From users
            WHERE username = $1`,
            [username]
        );

        if (checkForDuplicate.rows[0]) {
            throw new BadRequestError(`Duplicate usrname: ${username}`);
        }

        const hashedPassword  = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
                (username,
                password,
                first_name,
                last_name,
                email,
                is_admin)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
                isAdmin,
            ],
        );

        const user = result.rows[0];

        return user;
    };

    static async delete(username) {
        const result = await db.query(
            `DELETE FROM users
            WHERE username = $1
            RETURNING username`,
            [username]
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError (`No user: ${username}`);
    };
}

module.exports = User;