const knex = require("../db/connection");

function read() {
    return knex("scores")   // "scores" table should be quoted.
      .select("*")
      .orderBy("score", "asc")
      .limit(20);  // limit the results to the top 20 scores
  }


function create(score) {
  return knex("scores")
    .insert(score)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  create,
  read,
};