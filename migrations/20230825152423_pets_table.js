
exports.up = function (knex) {
    return knex.schema.createTable("pets_table", (table) => {
        table.increments("petId").primary();
        table.integer("userId ");
        table.string("type").notNull();
        table.string("name").notNull();
        table.enu("adoptionStatus", ["available", "fostered", "adopted"]).defaultTo("available");
        table.string("picture");
        table.integer("height");
        table.integer("weight");
        table.string("color");
        table.text("bio");
        table.boolean("hypoallergenic").defaultTo(false);
        table.string("dietary");
        table.string("breed");

    })
};


exports.down = function (knex) {
    return knex.schema.dropTable("pets_table");

};
