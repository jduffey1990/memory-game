/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('scores', function(table) {
      table.integer('score').notNullable().alter();
      // removed the line setting primary key
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('scores', function(table) {
      table.string('score').notNullable().alter();
      // no need to drop primary here since it wasn't added in the up migration
    });
};
