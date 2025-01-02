exports.up = function (knex) {
  return knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('image');
    table.date('startDate');
    table.date('endDate');
    table.integer('duration');
    table.float('rating');
    table.string('mentor');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('courses');
};
