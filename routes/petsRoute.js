const express = require("express");
const router = express.Router();

const {
  getAllPetsModel,
  getPetByIdModel,
  postPetByModel,
  updatePetModel,
  getSearchedPetsModel,
} = require("../models/petModel");

const { auth, upload } = require("../middlewares/middlewares");

router.get("/", async (request, response) => {
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

router.get("/:petId", async (request, response) => {
  try {
    const pet = await getPetByIdModel(request.params.petId);
    response.send(pet);
  } catch (err) {
    console.log(err);
    response.status(500).send(err.message);
  }
});

router.post("/", upload.single("picture"), auth, async (req, res) => {
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

router.put("/:petId", upload.single("picture"), auth, async (req, res) => {
  try {
    await updatePetModel(req.params.petId, req.body);

    res.status(200).send("Pet updated");
    console.log("pet updated");
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.log(err);
  }
});

module.exports = router;
