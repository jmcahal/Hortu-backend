"use strict";

const db = require('../db');
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { 
    BadRequestError, 
    NotFoundError,
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

    static async get(username) {
        const result = await db.query(
            `SELECT username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = result.rows[0]

        if (!user) throw new NotFoundError(`No user: ${username}`);

        return user;
    }

    static async update(username,data) {

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
                email: "email"
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