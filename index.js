const express = require("express");
const cors = require("cors");
const dbConnection = require("./knex/knex");
const app = express();
const usersRouter = require("./routes/usersRoute");
const petsRouter = require("./routes/petsRoute");
const petsUsersInteractionRouter = require("./routes/petsUsersInteractionRoute");

app.use(express.json());
// app.use(cors());

app.use("/users", usersRouter);
app.use("/pets", petsRouter);
app.use("/petsUsersInteraction", petsUsersInteractionRouter);

dbConnection.migrate.latest().then((migration) => {
  if (migration) {
    console.log(migration);
    console.log("Connected to DB ");

    app.listen(8080, () => {
      console.log("listening on  http://localhost:8080");
    });
  }
});
