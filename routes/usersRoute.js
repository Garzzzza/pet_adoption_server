const express = require("express");
const router = express.Router();

const {
  getAllUsersModel,
  postUserByModel,
  getUserByIdModel,
  updateUserModel,
} = require("../models/signModel");

const {
  passwordMatch,
  isNewUser,
  hashPwd,
  isExistingUser,
  comparePass,
  auth,
  upload,
} = require("../middlewares/middlewares");
const jwt = require("jsonwebtoken");

router.get("/", auth, async (request, response) => {
  try {
    const allUsers = await getAllUsersModel();
    response.send(allUsers);
  } catch (err) {
    console.log(err);
  }
});

router.post(
  "/signup",
  upload.single("picture"),

  passwordMatch,
  isNewUser,
  hashPwd,
  async (request, response) => {
    try {
      req.body.picture = req.file.path;

      const id = await postUserByModel(request.body);

      if (id !== 0) {
        response.status(200).send("good");
        console.log("user added");
      } else {
        response.status(500).send("good");
        console.log("user not added");
      }
    } catch {
      console.error("Error adding user:", err);
      res.status(500).send("Internal server error");
    }
  }
);

router.post(
  "/login",
  isExistingUser,
  comparePass,
  async (request, response) => {
    try {
      const token = jwt.sign(
        { id: request.body.user.userId, isAdmin: request.body.user.isAdmin },
        process.env.TOKEN_KEY,
        { expiresIn: "24h" }
      );
      response.send({ token: token });
    } catch (error) {
      console.log(error);
      response.status(500).send(error.message);
    }
  }
);

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await getUserByIdModel(req.body.userId);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.put("/update", auth, hashPwd, async (req, res) => {
  try {
    await updateUserModel(req.body.userId, req.body);
    console.log(req.body);
    res.status(200).send("User updated");
    console.log("updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.log(err);
  }
});

router.put("/toggleadmin", async (req, res) => {
  try {
    await updateUserModel(req.body.userId, req.body);
    console.log(req.body);
    res.status(200).send("User updated");
    console.log("updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.log(err);
  }
});

router.get("/:userId", auth, async (request, response) => {
  try {
    const user = await getUserByIdModel(request.params.userId);
    response.send(user);
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
});

module.exports = router;
