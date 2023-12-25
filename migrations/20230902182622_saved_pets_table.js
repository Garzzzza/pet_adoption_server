exports.up = function (knex) {
    return knex.schema.createTable("saved_pets_table", (table) => {
        table.increments("id").primary();
        table.integer("petId").unsigned().notNullable();
        table.integer("userId").unsigned().notNullable();


    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("saved_pets_table");
};
