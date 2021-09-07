const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/dbErrorHandling');
const nodemailer = require('nodemailer');
const Reservation = require('../models/Reservation');
const Machine = require('../models/Machine');
const CollectionAgency = require('../models/CollectionAgency');
const ObjectID = require('mongoose').Types.ObjectId;  // les ID  sont reconnu par la base de donner(verifier ID par rapport DB)


let transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.MDP_EMAIL
    }

});

exports.reservationController = async (req, res) => {

    const { name, city, startDate, endDate, email, idMachine, reserved, phoneNumber, typeOfRenting } = req.body;

    console.log(req.body)

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });


    } else {



        const token = jwt.sign(
            {
                name,
                email,
                startDate,
                endDate,
                city,
                idMachine,
                reserved,
                typeOfRenting,
                phoneNumber
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '5m'
            }
        );

        console.log(token);



        let transporter = nodemailer.createTransport({

            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.MDP_EMAIL
            }

        });

        let mailOptions = {

            from: 'youssef.ayari1@esprit.tn',
            to: "youssef.ayari1@esprit.tn",
            subject: 'Reservation',
            text: ' reservation',
            html: `
                  
            <h1>Please use the following to confirm  reservation</h1>
            <p>http://vallean-orange.herokuapp.com/reservation/confirm/${token}/${idMachine}</p>
            <hr />
            <img src='https://image.shutterstock.com/image-illustration/reservation-confirmed-red-rubber-stamp-260nw-499947085.jpg' style={{widh:'10px',height:'10px'}}/>
            <p>This email may containe sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
              
            `
            // taswira tkoun teb3aa ttkoul welcome to Vlean application ...
        }



        transporter.sendMail(mailOptions, function (err, data) {

            if (err) {

                return res.status(400).json({
                    success: false,
                    errors: errorHandler(err)
                });


            } else {

                console.log("saleeeem")

                return res.status(200).json({
                    success: true,
                    message: `Email has been sent to admin to confirm your reservation`
                });


            }
        })



    }
};

exports.confirmReservation = (req, res) => {

    const { token } = req.body;


    if (token) {

        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {

            if (err) {
                console.log('Activation error');
                return res.status(401).json({
                    errors: 'Expired link. Signup again'
                });

            } else {

                console.log(jwt.decode(token));
                const { name, email, startDate,
                    endDate, city, typeOfRenting, phoneNumber } = jwt.decode(token);

                const reserved = 'Active';
               const  succesMessage = `Success reservation from ${name}`;


                const reservation = new Reservation({
                    name,
                    email,
                    city,
                    startDate,
                    endDate,
                    typeOfRenting,
                    reserved,
                    phoneNumber,
                    succesMessage

                });



                reservation.save((err, user) => {

                    console.log(err)

                    if (err) {
                        console.log('Save error', errorHandler(err));
                        return res.status(401).json({
                            errors: errorHandler(err)
                        });
                    } else {

                        let mailOptions = {

                            from: 'youssef.ayari1@esprit.tn',
                            to: email,
                            subject: 'Succefully Reservation',
                            text: 'Succefully reservation',
                            html: `
                                  
                            <p>Your reservation has been confirmed </p>
                             
                            `
                        }
                        transporter.sendMail(mailOptions, function (err, data) {
                        })

                        return res.json({
                            success: true,
                            message: reservation,
                        });
                    }
                });
            }
        });
    } else {
        return res.json({
            message: 'error happening please try again'
        });
    }
};


exports.addMachine = (req, res) => {

    const { longitude, latitude, location, color } = req.body;

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });


    } else {


        const machine = new Machine({
            longitude,
            latitude,
            location,
            color


        });


        machine.save((err, reser) => {

            console.log(err)

            if (err) {
                console.log('Save error', errorHandler(err));
                return res.status(401).json({
                    errors: errorHandler(err)
                });
            } else {
                return res.json({
                    success: true,
                    data: machine,
                    message: 'Success add'
                });
            }
        });
    }

};


module.exports.getAllMachine = (req, res) => {

    Machine.find((err, data) => {

        if (!err)

            return res.status(200).json(data);

        else res.status(401).json({ err });
    });

}


module.exports.getAllReservation = (req, res) => {

    Reserv.find((err, data) => {

        if (!err)

            return res.status(200).json(data);

        else res.status(401).json({ err });
    });

}

module.exports.addMachineToAgencyCollection = async (req, res) => {


    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idMachine))   // si lID est connu dans la base de donner

        return res.status(400).send('ID unknown :' + req.params.id);



    try {

        await CollectionAgency.findByIdAndUpdate(

            req.params.id,

            { $addToSet: { machine: req.body.idMachine } }, // najouti fel lista normalement 
            { new: true, upsert: true },

            (err, data) => {

                if (!err)

                    res.status(201).json(data);

                else return res.status(500).json(err);

            }

        );




    } catch (err) {

        console.log(err)

    }
}

exports.getReservation = (req, res) => {

    Reservation.findOne({
        email
    }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                errors: 'Email is taken'
            });
        }
    });

}






module.exports.putMachineReserved = async (req, res) => {

    const { color } = req.body


    if (!ObjectID.isValid(req.params.idMachine))   // si lID est connu dans la base de donner

        return res.status(400).send('ID unknown :' + req.params.idMachine);

    console.log(req.params.idMachine)

    try {

        await Machine.findByIdAndUpdate(

            req.params.idMachine,

            { $set: { color: color } }, // najouti fel lista normalement 
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



module.exports.addReservationToMachine = async (req, res) => {


    if (!ObjectID.isValid(req.body.id) || !ObjectID.isValid(req.params.idMachine))   // si lID est connu dans la base de donner

        return res.status(400).send('ID unknown :' + req.body.id);



    try {

        await Machine.findByIdAndUpdate(

            req.params.idMachine,

            {
                $addToSet: {
                    reservation: {
                        id: req.body.id, name: req.body.name, reserved: req.body.reserved,
                        typeOfRenting: req.body.typeOfRenting, city: req.body.city,
                        phoneNumber: req.body.phoneNumber
                    }
                }
            }, // najouti fel lista normalement 
            { new: true, upsert: true },

            (err, data) => {

                if (!err)

                    res.status(201).json(data);

                else return res.status(500).json(err);

            }

        );




    } catch (err) {

        console.log(err)

    }
}

