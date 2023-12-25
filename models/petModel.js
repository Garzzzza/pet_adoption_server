const fileSystem = require('fs');
const path = require('path');
const dbConnection = require("../knex/knex")


async function getAllPetsModel() {
    try {
        const allPets = await dbConnection.from('pets_table')
        return allPets
    }
    catch (err) {
        console.log('An error occurred:', err);
    }
}

async function getPetByIdModel(petId) {
    try {

        const pet = await dbConnection('pets_table').where({ petId: petId }).first()
        return pet
    }
    catch (error) {
        console.log(error)
    }
}

async function postPetByModel(newPet) {
    try {
        const queryResult = await dbConnection('pets_table').insert(newPet)
        const id = queryResult[0]
        newPet.petId = id
        return newPet
    } catch (error) {
        console.log("DB Error:", error);
        return "not added";
    }
}

async function updatePetModel(petId, updatedPet) {
    try {
        await dbConnection("pets_table")
            .where({ petId: petId })
            .update(updatedPet);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const getSearchedPetsModel = async (queryObj) => {

    try {
        const pets = await dbConnection.from('pets_table').where(queryObj);
        return pets
    } catch (error) {
        console.log("DB Error:", error);
    }
}

module.exports = {
    getAllPetsModel, getPetByIdModel, postPetByModel, updatePetModel,
    getSearchedPetsModel,
};
