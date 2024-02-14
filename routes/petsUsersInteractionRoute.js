const express = require("express");
const router = express.Router();

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
} = require("../models/petUserModel");

const { auth, upload } = require("../middlewares/middlewares");

router.post("/savedpets/:userId/:petId", auth, async (req, res) => {
  try {
    const petToSave = await savePetModel(req.params.userId, req.params.petId);
    res.status(200).send("User-SavedPet relationship added.");
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error("Exception caught:", error);
  }
});

router.get("/savedpets", auth, async (request, response) => {
  try {
    const savedPets = await getSavedPetsModel();
    response.send(savedPets);
  } catch (error) {
    console.error("There was a problem:", error);
    response.status(500).send("Internal Server Error");
  }
});

router.delete("/savedpets/:userId/:petId", auth, async (request, response) => {
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

router.post("/fosteredpets/:userId/:petId", auth, async (req, res) => {
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

router.get("/fosteredpets", auth, async (request, response) => {
  try {
    const fosteredPets = await getFosteredPetsModel();
    response.send(fosteredPets);
  } catch (error) {
    console.error("There was a problem:", error);
    response.status(500).send("Internal Server Error");
  }
});

router.delete(
  "/fosteredpets/:userId/:petId",
  auth,
  async (request, response) => {
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
  }
);

router.post("/adoptedpets/:userId/:petId", auth, async (req, res) => {
  try {
    const petToAdopt = await adoptPetModel(req.params.userId, req.params.petId);
    res.status(200).send("User-AdoptedPet relationship added.");
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error("Exception caught:", error);
  }
});

router.get("/adoptedpets", auth, async (request, response) => {
  try {
    const adoptedPets = await getAdoptedPetsModel();
    response.send(adoptedPets);
  } catch (error) {
    console.error("There was a problem:", error);
    response.status(500).send("Internal Server Error");
  }
});

router.delete(
  "/adoptedpets/:userId/:petId",
  auth,
  async (request, response) => {
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
  }
);

module.exports = router;
