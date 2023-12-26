const express = require("express");
const fileSystem = require("fs");
const path = require("path");
const cors = require("cors");
const {
  getAllPetsModel,
  getPetByIdModel,
  postPetByModel,
  updatePetModel,
  getSearchedPetsModel,
} = require("./models/petModel");
const {
  getAllUsersModel,
  postUserByModel,
  getUserByIdModel,
  updateUserModel,
} = require("./models/signModel");

const {
  savePetModel,
  getSavedPetsModel,
  deleteSavedPetModel,
  adoptPetModel,
  getAdoptedPetsModel,
  deleteAdoptedPetModel,
  fosterPetModel,
  getFosteredPetsModel,
  deleteFosteredPetModel,
} = require("./models/petUserModel");
const dbConnection = require("./knex/knex");
const {
  passwordMatch,
  isNewUser,
  hashPwd,
  isExistingUser,
  comparePass,
  auth,
  upload,
} = require("./middlewares/middlewares");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const pathToImagesFolder = path.resolve(__dirname, "./images");

app.use(express.json());

const corsOptions = {
  origin: "https://pet-adoption-client-tau.vercel.app",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/images", express.static(pathToImagesFolder));

app.get("/pets", async (request, response) => {
  try {
    let queryObj = {};

    if (request.query.type) queryObj.type = request.query.type;
    if (request.query.name) queryObj.name = request.query.name;
    if (request.query.adoptionStatus)
      queryObj.adoptionStatus = request.query.adoptionStatus;
    if (request.query.height > 0)
      queryObj.height = parseInt(request.query.height);
    if (request.query.weight > 0)
      queryObj.weight = parseInt(request.query.weight);

    let pets;

    if (Object.keys(queryObj).length > 0) {
      pets = await getSearchedPetsModel(queryObj);
    } else {
      pets = await getAllPetsModel();
    }

    response.send(pets);
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
});

app.get("/pets/:petId", async (request, response) => {
  try {
    const pet = await getPetByIdModel(request.params.petId);
    response.send(pet);
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
});

app.post("/pets", upload.single("picture"), auth, async (req, res) => {
  try {
    req.body.userId = null;
    req.body.picture = req.file.path;
    const result = await postPetByModel(req.body);
    console.log(result);
    res.status(200).send("Pet added");
    console.log("Pet added");
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.log("Exception caught:", error);
  }
});

app.put("/pets/:petId", upload.single("picture"), auth, async (req, res) => {
  try {
    await updatePetModel(req.params.petId, req.body);

    res.status(200).send("Pet updated");
    console.log("pet updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.log(err);
  }
});

app.post("/savedpets/:userId/:petId", auth, async (req, res) => {
  try {
    const petToSave = await savePetModel(req.params.userId, req.params.petId);
    res.status(200).send("User-SavedPet relationship added.");
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error("Exception caught:", error);
  }
});

app.get("/savedpets", auth, async (request, response) => {
  try {
    const savedPets = await getSavedPetsModel();
    response.send(savedPets);
  } catch (error) {
    console.error("There was a problem:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.delete("/savedpets/:userId/:petId", auth, async (request, response) => {
  try {
    const isDeleted = await deleteSavedPetModel(
      request.params.userId,
      request.params.petId
    );
    response.send({ isDeleted });
  } catch (err) {
    console.log(err);
    response.status(500).send("Something went wrong");
  }
});

app.post("/fosteredpets/:userId/:petId", auth, async (req, res) => {
  try {
    const petToFoster = await fosterPetModel(
      req.params.userId,
      req.params.petId
    );
    res.status(200).send("User-FosteredPet relationship added.");
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error("Exception caught:", error);
  }
});

app.get("/fosteredpets", auth, async (request, response) => {
  try {
    const fosteredPets = await getFosteredPetsModel();
    response.send(fosteredPets);
  } catch (error) {
    console.error("There was a problem:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.delete("/fosteredpets/:userId/:petId", auth, async (request, response) => {
  try {
    const isDeleted = await deleteFosteredPetModel(
      request.params.userId,
      request.params.petId
    );
    response.send({ isDeleted });
  } catch (err) {
    console.log(err);
    response.status(500).send("Something went wrong");
  }
});

app.post("/adoptedpets/:userId/:petId", auth, async (req, res) => {
  try {
    const petToAdopt = await adoptPetModel(req.params.userId, req.params.petId);
    res.status(200).send("User-AdoptedPet relationship added.");
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error("Exception caught:", error);
  }
});

app.get("/adoptedpets", auth, async (request, response) => {
  try {
    const adoptedPets = await getAdoptedPetsModel();
    response.send(adoptedPets);
  } catch (error) {
    console.error("There was a problem:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.delete("/adoptedpets/:userId/:petId", auth, async (request, response) => {
  try {
    const isDeleted = await deleteAdoptedPetModel(
      request.params.userId,
      request.params.petId
    );
    response.send({ isDeleted });
  } catch (err) {
    console.log(err);
    response.status(500).send("Something went wrong");
  }
});

app.get("/users", auth, async (request, response) => {
  try {
    const allUsers = await getAllUsersModel();
    response.send(allUsers);
  } catch (err) {
    console.log(err);
  }
});

app.post(
  "/users/signup",
  /*validateBody(signupSchema)*/ passwordMatch,
  isNewUser,
  hashPwd,
  async (request, response) => {
    const newUser = {
      fullName: request.body.fullName,
      signUpEmail: request.body.signUpEmail,
      signUpPass: request.body.signUpPass,
    };
    const id = await postUserByModel(newUser);

    if (id !== 0) {
      response.status(200).send("good");
      console.log("user added");
    } else {
      response.status(500).send("good");
      console.log("user not added");
    }
  }
);

app.post(
  "/users/login",
  isExistingUser,
  comparePass,
  async (request, response) => {
    try {
      const token = jwt.sign(
        { id: request.body.user.userId, isAdmin: request.body.user.isAdmin },
        process.env.TOKEN_KEY,
        { expiresIn: "20h" }
      );
      response.send({ token: token });
    } catch (error) {
      console.log(error);
      response.status(500).send(error.message);
    }
  }
);

app.get("/users/profile", auth, async (req, res) => {
  try {
    const user = await getUserByIdModel(req.body.userId);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Update a user
app.put("/users/update", auth, hashPwd, async (req, res) => {
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

app.put("/users/toggleadmin", async (req, res) => {
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

app.get("/users/:userId", auth, async (request, response) => {
  try {
    const user = await getUserByIdModel(request.params.userId);
    response.send(user);
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
});

dbConnection.migrate.latest().then((migration) => {
  if (migration) {
    console.log(migration);
    console.log("Connected to DB ");

    app.listen(8080, () => {
      console.log("listening on  http://localhost:8080");
    });
  }
});
