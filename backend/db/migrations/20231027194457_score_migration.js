/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('scores', function(table) {
      table.increments('score_id');
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("score").notNullable();
      
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('scores');
  };
