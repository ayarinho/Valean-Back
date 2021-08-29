const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/dbErrorHandling');
const Machine = require('../models/Machine');
const Trash = require('../models/Trash');
const ObjectID = require('mongoose').Types.ObjectId;  // les ID  sont reconnu par la base de donner(verifier ID par rapport DB)


module.exports.addTrash = (req, res) => {

    const { location, state, quantity } = req.body;

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });


    } else {


        const trash = new Trash({
            location,
            quantity,
            state


        });


        trash.save((err, tsh) => {

            console.log(err)

            if (err) {
                console.log('Save error', errorHandler(err));
                return res.status(401).json({
                    errors: errorHandler(err)
                });
            } else {
                return res.json({
                    success: true,
                    data: trash,
                    message: 'Success add'
                });
            }
        });
    }

}


module.exports.addTrashToMachine = async (req, res) => {


    if (!ObjectID.isValid(req.params.id))   // si lID est connu dans la base de donner

        return res.status(400).send('ID unknown :' + req.params.id);

    console.log(req.params.id)

    try {

        await Machine.findByIdAndUpdate(

            req.params.id,

            { $addToSet: { trash: {id:req.body.id,location:req.body.location,state:req.body.state,quantity:req.body.quantity } }}, // najouti fel lista normalement 
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