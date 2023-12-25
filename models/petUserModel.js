const fileSystem = require('fs');
const path = require('path');
const dbConnection = require("../knex/knex")


async function savePetModel(userId, petId) {
    try {

        const pet = await dbConnection('saved_pets_table').insert({
            userId: userId,
            petId: petId,
        });
        return pet
    }
    catch (error) {
        console.log("DB Error:", error);

    }
}

const getSavedPetsModel = async () => {

    const savedPets = await dbConnection.from('saved_pets_table')
        .join('pets_table', 'saved_pets_table.petId', '=', 'pets_table.petId')
        .select('pets_table.*')
    return savedPets
}

async function deleteSavedPetModel(userId, petId) {
    try {
        if (userId && userId !== 'null') {
            return await dbConnection('saved_pets_table')
                .where({ petId: petId, userId: userId })
                .del();
        }
        else {
            return await dbConnection('saved_pets_table')
                .where({ petId: petId })
                .del();
        }

    } catch (err) {
        console.log(err)
    }
}

async function fosterPetModel(userId, petId) {
    try {

        const fosterPet = await dbConnection('fostered_pets_table').insert({
            userId: userId,
            petId: petId,
        });
        return fosterPet
    }
    catch (error) {
        console.log("DB Error:", error);

    }
}

const getFosteredPetsModel = async () => {

    const fosteredPets = await dbConnection.from('fostered_pets_table')
        .join('pets_table', 'fostered_pets_table.petId', '=', 'pets_table.petId')
        .select('pets_table.*')
    return fosteredPets
}

async function deleteFosteredPetModel(userId, petId) {
    try {
        if (userId && userId !== 'null') {
            return await dbConnection('fostered_pets_table')
                .where({ petId: petId, userId: userId })
                .del();
        } else {
            return await dbConnection('fostered_pets_table')
                .where({ petId: petId })
                .del();
        }
    } catch (err) {
        console.log(err);
    }
}





async function adoptPetModel(userId, petId) {
    try {

        const pet = await dbConnection('adopted_pets_table').insert({
            userId: userId,
            petId: petId,
        });
        return pet
    }
    catch (error) {
        console.log("DB Error:", error);

    }
}

const getAdoptedPetsModel = async () => {

    const adoptedPets = await dbConnection.from('adopted_pets_table')
        .join('pets_table', 'adopted_pets_table.petId', '=', 'pets_table.petId')
        .select('pets_table.*')
    return adoptedPets
}

async function deleteAdoptedPetModel(userId, petId) {
    try {

        const isDeleted = await dbConnection('adopted_pets_table').where({ petId: petId, userId: userId }).del()
        return isDeleted

    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    savePetModel, getSavedPetsModel, deleteSavedPetModel,
    adoptPetModel, getAdoptedPetsModel, deleteAdoptedPetModel,
    fosterPetModel, getFosteredPetsModel, deleteFosteredPetModel,
};
