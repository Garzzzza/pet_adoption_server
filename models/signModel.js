const dbConnection = require("../knex/knex");

async function getAllUsersModel() {
  try {
    const allUsers = await dbConnection.from("users_table");
    return allUsers;
  } catch (err) {
    console.log("An error occurred:", err);
  }
}

async function postUserByModel(newUser) {
  try {
    const [id] = await dbConnection("users_table").insert(newUser);
    return id;
  } catch (err) {
    console.log(err);
  }
}

async function getUserByEmailModel(email) {
  try {
    const user = await dbConnection("users_table")
      .where({ signUpEmail: email })
      .first();
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function getUserByIdModel(userId) {
  try {
    const user = await dbConnection("users_table")
      .where({ userId: userId })
      .first();
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function updateUserModel(userId, updatedUser) {
  try {
    await dbConnection("users_table")
      .where({ userId: userId })
      .update(updatedUser);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  getAllUsersModel,
  postUserByModel,
  getUserByEmailModel,
  getUserByIdModel,
  updateUserModel,
};
