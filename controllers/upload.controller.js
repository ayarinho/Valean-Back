
const fs = require('fs'); //dependance de node pour creer des fichiers ...
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors');
const pipeline = promisify(require('stream').pipeline);
const CollectionAgency = require('../models/CollectionAgency');
const ObjectID = require('mongoose').Types.ObjectId;  // les ID  sont reconnu par la base de donner(verifier ID par rapport DB)

var cloudinary = require('cloudinary').v2


cloudinary.config({
    cloud_name: 'orange112',
    api_key: '768953986487721',
    api_secret: 'Z8ZsrqRZeOm5trw2NmGwUb0LvcA'
});

/////////

module.exports.uploadCloudinary = (req, res, next) => {

    const file = req.files.photo;

    //console.log(file.tempFilePath);
    console.log(file);

    cloudinary.uploader.upload(file.tempFilePath, { folder: 'test' }, function (err, result) {

        res.send({

            success: true,
            result
        })


    })

}


module.exports.setPhotoCloudinary =async  (req, res) => {
 

    const { url } = req.body


    if (!ObjectID.isValid(req.params.id))   // si lID est connu dans la base de donner

        return res.status(400).send('ID unknown :' + req.params.id);

    console.log(req.params.id)

    try {

        await CollectionAgency.findByIdAndUpdate(

            req.params.id,

            { $set: { logo: url } }, // najouti fel lista normalement 
            { new: true, upsert: true },

            (err, data) => {

                if (!err)

                    res.status(201).json(data);

                else return res.status(500).json(err.message);

            }

        );




    } catch (err) {

        console.log(err)

    }

}




module.exports.uploadProfil = async (req, res) => {


    try {

        if (req.file.detectedMimeType !== "image/jpg" && req.file.detectedMimeType !== "image/png" &&
            req.file.detectedMimeType !== "image/jpeg")

            throw Error("invalid file");

        if (req.file.size > 500000) throw Error("max size");
    } catch (err) {

        const errors = uploadErrors;

        return res.status(201).json({ errors });
    }


    const fileName = req.body.name + ".jpg";

    await pipeline(    //permet de creer fichier avec fs

        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../../mon-app/public/uploads/${fileName}`
        )
    )


    try {

        await CollectionAgency.findByIdAndUpdate(

            req.body._id,

            { $set: { logo: fileName } },           //houni,kima setter fe java
            { new: true, setDefaultsOnInsert: true, upsert: true },

            (err, data) => {

                if (!err) return res.send(data);
                else return res.status(500).send({ message: err })
            }
        );

    } catch (err) {

        return res.status(500).send(err);
    }

}