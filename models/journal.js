const db = require('../db');
const { sqlForPartialUpdate } = require("../helpers/sql");
const { BadRequestError, NotFoundError } = require('../expressError');

// CRUD functions for journals

class Journal {

      // Find all journals.

      static async findAll(){
        let query = `SELECT id, title,
                            description,
                            username,
                            plant_id AS "plantId"
                    FROM journals`;
        const journalRes = await db.query(query);
        return journalRes.rows;
    }

    // Find all journals for a given user.

    static async findUserJournals(username){
        const journalRes = await db.query (`SELECT id,
                        username,
                        title,
                        description,
                        plant_id AS "plantId"
                    FROM journals
                    WHERE username = $1
                    ORDER BY id`,
                    [username]);
        return journalRes.rows;
    }

    // Find all journals for a plant given the plantId.

    static async get(plantId) {
        const journalRes = await db.query (`SELECT id,
                        username,
                        title,
                        description,
                        plant_id AS "plantId"
                    FROM journals
                    WHERE plant_id = $1`,
                    [plantId]);
        const journals = journalRes.rows;

        if (!journals) throw new NotFoundError(`No journal for the plant with id: ${plantId}`)

        return journals;
    };

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
                                description,
                                plant_id AS "plantId"`;
        const result = await db.query(querySql, [...values, id]);
        console.log(result);
        const journal = result.rows[0];

        return journal;

    };

    // Create a journal.

    static async create({
        username,
        title,
        description,
        plantId}) {

        const result = await db.query(
        `INSERT INTO journals
        (username, 
            title, 
            description,
            plant_id)
        VALUES ($1,$2,$3,$4)
        RETURNING id, username, 
            title, 
            description,
            plant_id AS "plantId"`,
        [
            username,
            title,
            description,
            plantId
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