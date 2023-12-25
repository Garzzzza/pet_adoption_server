
exports.up = async function (knex) {
    await knex.schema.createTable("users_table", (table) => {
        table.increments("userId").primary();
        table.string("fullName").notNull();
        table.string("signUpEmail").notNull();
        table.string("phoneNumber");
        table.string("signUpPass").notNull();
        table.boolean("isAdmin").defaultTo(false)
    });

    return knex.insert([
        { fullName: "Amit", signUpEmail: "agerzee@gmail.com", phoneNumber: "0526205751", signUpPass: "$2b$05$VUlPJLgvn93XqqIzc0yk6eSrpRNtLWBBJaxuLhK2GGvCtvEysGaWC", isAdmin: 1 }
    ]).into("users_table");
};


exports.down = function (knex) {
    return knex.schema.dropTable("users_table");

};
