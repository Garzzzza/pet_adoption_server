const { getUserByEmailModel } = require('../models/signModel')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const path = require("path")
const multer = require('multer');
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');


function passwordMatch(req, res, next) {
    if (req.body.signUpPass !== req.body.reSignUpPass) {
        return res.status(400).send('Passwords dont match')
    }
    next()
}

async function isNewUser(req, res, next) {
    const user = await getUserByEmailModel(req.body.signUpEmail)
    if (user) {
        return res.status(400).send('User with this email already exists')
    }
    next()
}


function hashPwd(req, res, next) {
    const saltRounds = 5
    bcrypt.hash(req.body.signUpPass, saltRounds, (err, hash) => {
        if (err) {
            res.status(400).send('Error hashing password')
        } else {
            req.body.signUpPass = hash
            next()
        }
    });
}

async function isExistingUser(req, res, next) {
    const user = await getUserByEmailModel(req.body.signInEmail)
    if (user) {
        req.body.user = user
        next()
    } else {
        res.status(400).send('User with this email does not exist')
    }
}

async function comparePass(request, response, next) {
    try {
        bcrypt.compare(request.body.signInPass, request.body.user.signUpPass, (err, result) => {
            if (!result) {
                return response.status(401).send('Incorrect password')
            }
            if (err) {
                return response.status(500).send('Error comparing')
            }
            if (result) {
                next()
            }
        });
    } catch (err) {
        console.log(err)
        response.status(500).send(err.message)
    }
}

function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Authorization headers required')
    }
    const token = req.headers.authorization.replace('Bearer ', '')

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token')
        }
        req.body.userId = decoded.id

        next()
    });
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: cloudStorage });



// function checkIfAdmin(request, response, next) {
//     const token = request.headers.authorization.replace('Bearer ', '')
//     jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
//         if (err) {
//             return response.status(401).send('Invalid token')
//         }
//         if (decoded.isAdmin) {
//             request.body.user.isAdmin = decoded.isAdmin
//             next()
//         } else {
//             response.status(403).send('You dont permission')
//         }

//     });
// }

// function isAdmin(request, response, next) {
//     try {
//         if (request.body.user.admin === 1) {
//             next();
//         } else {
//             response.status(403).send("Forbidden access");
//             return;
//         }
//     } catch (error) {
//         response.status(500).send(error);
//     }
// }

module.exports = { passwordMatch, isNewUser, hashPwd, isExistingUser, comparePass, auth, upload, }

