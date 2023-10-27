/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes existing entries
  return knex('scores').del()
      .then(function() {
          // Inserts seed entries
          const getRandomScore = () => Math.floor(Math.random() * (201 - 45) + 45);
          
          return knex('scores').insert([
              { first_name: 'Taylor', last_name: 'Swift', score: getRandomScore().toString() },
              { first_name: 'Tom', last_name: 'Brady', score: getRandomScore().toString() },
              { first_name: 'Marcus', last_name: 'Aurelius', score: getRandomScore().toString() },
              { first_name: 'John', last_name: 'Elway', score: getRandomScore().toString() },
              { first_name: 'Bluey', last_name: 'Heeler', score: getRandomScore().toString() },
              { first_name: 'Clark', last_name: 'Kent', score: getRandomScore().toString() },
              { first_name: 'Bruce', last_name: 'Wayne', score: getRandomScore().toString() },
              { first_name: 'Luke', last_name: 'Skywalker', score: getRandomScore().toString() },
              { first_name: 'Darth', last_name: 'Vader', score: getRandomScore().toString() },
              { first_name: 'Snow', last_name: 'White', score: getRandomScore().toString() }
          ]);
      });
};
