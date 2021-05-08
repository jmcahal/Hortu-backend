const db = require('../db');
const { sqlForPartialUpdate } = require("../helpers/sql");
const { BadRequestError, NotFoundError } = require('../expressError');

// CRUD functions for journals

class Journal {

      // Find all journals.

      static async findAll(){
        let query = `SELECT id, title,
                            description,
                            username
                    FROM journals`;
        const journalRes = await db.query(query);
        return journalRes.rows;
    }

    // Find all journals for a given user.

    static async findUserJournals(username){
        const journalRes = await db.query (`SELECT id,
                        username,
                        title,
                        description
                    FROM journals
                    WHERE username = $1`,
                    [username]);
        return journalRes.rows;
    }

    // Find a journal given its id.

    // static async get(id) {
    //     const journalRes = await db.query (`SELECT id,
    //                     username,
    //                     title,
    //                     description
    //                 FROM journals
    //                 WHERE id = $1`,
    //                 [id]);
    //     const journal = journalRes.rows[0];

    //     if (!journal) throw new NotFoundError(`No journal with the id: ${id}`)

    //     return journal;
    // };

    // Update a journal given its id.

    static async update(id,data) {

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                tite: "title",
                description: "description"
            }
        );
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE journals
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING username,
                                title,
                                description`;
        const result = await db.query(querySql, [...values, id]);
        console.log(result);
        const journal = result.rows[0];

        return journal;

    };

    // Create a journal.

    static async create({
        username,
        title,
        description}) {

        const result = await db.query(
        `INSERT INTO journals
        (username, 
            title, 
            description)
        VALUES ($1,$2,$3)
        RETURNING username, 
            title, 
            description`,
        [
            username,
            title,
            description
        ]
        );
        const journal = result.rows[0];

        return journal;    
    };

    static async delete(id) {
        const result = await db.query(
        `DELETE FROM journals
        WHERE id = $1
        RETURNING id`,
        [id]
        );
        const journal = result.rows[0];

        if (!journal) throw new NotFoundError (`No journal with id: ${id}`);
    };

}

module.exports = Journal; 