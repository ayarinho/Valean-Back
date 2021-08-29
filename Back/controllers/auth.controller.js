
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/dbErrorHandling');
const nodemailer = require('nodemailer');
const CollectionAgency = require('../models/CollectionAgency');
const fetch = require('node-fetch')
const Admin = require('../models/Admin');
const ObjectID = require('mongoose').Types.ObjectId;  // les ID  sont reconnu par la base de donner(verifier ID par rapport DB)
const AdminModel = require('../models/Admin');
const Machine = require('../models/Machine');


exports.registerController = (req, res) => {

    const { name, email, password, address, phoneNumber, role, logo } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {

        CollectionAgency.findOne({
            email
        }).exec((err, user) => {
            if (user) {
                return res.status(400).json({
                    errors: 'Email is taken'
                });
            }
        });



        const token = jwt.sign(
            {
                name,
                email,
                password,
                address,
                phoneNumber,
                role,
                logo
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
        console.log(process.env.CLIENT_URL)

        let mailOptions = {

            from: 'youssef.ayari1@esprit.tn',
            to: email,
            subject: 'Registration',
            text: 'succefully registration',
            html: `
                  
            <h1>Please use the following to activate your account</h1>
            <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
            <hr />
            <img src='http://res.cloudinary.com/orange112/image/upload/v1629673080/test/kdvf0jquwmqa8jcdtzwg.png' 
            style={{width:'30px',height:'30px'}}/>
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
                    message: `Email has been sent to ${email}`
                });
            }
        })
    }
};

////////////////////////////////

exports.activationController = (req, res) => {

    const { token } = req.body;

    if (token) {

        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {

            if (err) {
                console.log('Activation error');
                return res.status(401).json({
                    errors: 'Expired link. Signup again'
                });

            } else {

                console.log(jwt.decode(token))
                const { name, email, password, address, phoneNumber, role, logo } = jwt.decode(token);

                console.log(CollectionAgency.role);

                const collectionAgency = new CollectionAgency({
                    name,
                    email,
                    password,
                    address,
                    phoneNumber,
                    role,
                    logo
                });



                collectionAgency.save((err, user) => {

                    console.log(err)

                    if (err) {
                        console.log('Save error', errorHandler(err));
                        return res.status(401).json({
                            errors: errorHandler(err)
                        });
                    } else {
                        return res.json({
                            success: true,
                            message: collectionAgency,
                            //message: 'Signup success'
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

//////////////////////////

exports.signinController = (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    console.log(errors)

    if (!errors.isEmpty()) {                           // express-validator maantha ay haja hors eli hatitha enty
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {

        // check if user exist
        CollectionAgency.findOne({
            email
        }).exec((err, user) => {
            if (err || !user) {

                return res.status(400).json({
                    errors: 'User with that email does not exist. Please signup'
                });
            }
            // authenticate
            if (!user.authenticate(password)) {   // user andou methode authenticate 
                return res.status(400).json({
                    errors: 'Email and password do not match'
                });
            }

            // generate a token and send to client
            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            );
            const { _id, name, email, role, logo, isconnected, colorIsConnected } = user;

            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    role,
                    logo,
                    isconnected,
                    colorIsConnected
                }
            });
        });

    }

};

////////////////////////////

exports.forgotPasswordController = (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        CollectionAgency.findOne(
            {
                email
            },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'User with that email does not exist'
                    });
                }

                const token = jwt.sign(
                    {
                        _id: user._id
                    },
                    process.env.JWT_RESET_PASSWORD,
                    {
                        expiresIn: '10m'
                    }
                );

                let transporter = nodemailer.createTransport({

                    service: 'gmail',
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.MDP_EMAIL
                    }

                });

                let mailOptions = {

                    from: 'youssef.ayari1@esprit.tn',
                    to: email,
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: `Password Reset link`,
                    html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
                    // taswira tkoun teb3aa ttkoul welcome to Vlean application ...
                }



                return user.updateOne(           //j'ai pas compris updateOne et asyncHandler
                    {
                        resetPasswordLink: token
                    },
                    (err, success) => {
                        if (err) {
                            console.log('RESET PASSWORD LINK ERROR', err);
                            return res.status(400).json({
                                error:
                                    'Database connection error on user password forgot request'
                            });
                        } else {


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
                                        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                                    });
                                }
                            })
                        }
                    }
                );
            }
        );
    }
};

///////////////////////////////

exports.resetPasswordController = (req, res) => {

    const { resetPasswordLink, newPassword } = req.body;

    console.log('reseeeeeeeeeeeeeeeeeeeeeet ', resetPasswordLink)

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        if (resetPasswordLink) {
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (  // verifier token si valide ou non 
                err,
                decoded
            ) {
                if (err) {
                    return res.status(400).json({
                        error: 'Expired link. Try again'
                    });
                }

                CollectionAgency.findOne(
                    {
                        resetPasswordLink
                    },
                    (err, user) => {
                        console.log(err)
                        if (err || !user) {
                            return res.status(400).json({
                                error: 'Something went wrong. Try later'
                            });
                        }

                        const updatedFields = {
                            password: newPassword,
                            resetPasswordLink: ''
                        };

                        console.log('hetha useeeeeeeeeeeeeeeeeer kbaaal', user)


                        user = _.extend(user, updatedFields);  // copie sur l'objet de destination et izidou l'objet a ajouter 

                        console.log('hetha useeeeeeeeeeeeeeeeeer ', _.extend(user, updatedFields))

                        user.save((err, result) => {
                            if (err) {
                                return res.status(400).json({
                                    error: 'Error resetting user password'
                                });
                            }
                            res.json({
                                message: `Great! Now you can login with your new password`
                            });
                        });
                    }
                );
            });
        }
    }
};

exports.facebookController = (req, res) => {
    console.log('FACEBOOK LOGIN REQ BODY', req.body);
    const { userID, accessToken } = req.body;

    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => {
                const { email, name } = response;
                CollectionAgency.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                            expiresIn: '7d'
                        });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new CollectionAgency({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            const token = jwt.sign(
                                { _id: data._id },
                                process.env.JWT_SECRET,
                                { expiresIn: '7d' }
                            );
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

// console.log('hetha client google ', client)
// Google Login
exports.googleController = (req, res) => {

    const { idToken } = req.body;

    console.log('hethaa idToken ', idToken)

    client
        .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
        .then(response => {
            // console.log('GOOGLE LOGIN RESPONSE',response)
            const { email_verified, name, email } = response.payload;

            console.log('hethaa mail verified ', email_verified) // hatli true
            console.log('hethaa mail normal ', email);
            console.log('hethaa name normal ', name);



            if (email_verified) {

                CollectionAgency.findOne({ email }).exec((err, user) => {           //hethy cas ken 3andi menou user fel base de donner 
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                            expiresIn: '7d'
                        });
                        const { _id, email, name, role, isconnected, colorIsConnected } = user;
                        console.log('ahawaa user ', user)

                        return res.json({
                            token,
                            user: { _id, email, name, role, colorIsConnected, isconnected }
                        });


                    }


                    else {
                        // ken mùaandich menou fel base de donner nsajlou jawou behi ama password yetbadel
                        let password = email + process.env.JWT_SECRET;

                        const phoneNumber = "26579007"

                        user = new CollectionAgency({ name, email, password, phoneNumber });

                        console.log(user)

                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with google'
                                });
                            }
                            const token = jwt.sign(
                                { _id: data._id },
                                process.env.JWT_SECRET,
                                { expiresIn: '7d' }
                            );
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            } else {
                return res.status(400).json({
                    error: 'Google login failed. Try again'
                });
            }
        });
};

exports.getAllUsers = (req, res) => {

    CollectionAgency.find((err, data) => {

        if (!err)

            return res.status(200).json(data);

        else res.status(401).json({ err });
    });

}

exports.addAdmin = async (req, res) => {

    const { userName, firstName, lastName, email, address, phoneNumber, city, country, picture, password, role } = req.body

    const admin = await Admin.create({

        userName,
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        city,
        country,
        picture,
        password,
        role

    });

    admin.save((err, user) => {

        console.log(err)

        if (err) {
            console.log('Save error', err.message);
            return res.status(401).json({
                errors: errorHandler(err)
            });
        } else {
            return res.json({
                success: true,
                message: admin,
                //message: 'Signup success'
            });
        }
    });
}


exports.getAdmin = (req, res) => {

    Admin.findOne({

    }).exec((err, user) => {
        if (user) {
            return res.status(200).json({
                message: user
            });
        }
    });

}

exports.updateAdminProfile = async (req, res) => {

    const { firstName, lastName, city, country, phoneNumber, address, userName, email } = req.body


    if (!ObjectID.isValid(req.params.id))   // si lID est connu dans la base de donner

        return res.status(400).send('ID unknown :' + req.params.id);

    console.log(req.params.id)

    try {

        await Admin.findByIdAndUpdate(

            req.params.id,

            {
                $set: {
                    firstName: firstName, lastName: lastName, city: city, email: email, country: country,
                    phoneNumber: phoneNumber, address: address, userName: userName
                }
            }, // najouti fel lista normalement 
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



exports.updateIsConnected = async (req, res) => {

    const { isconnected, colorIsConnected } = req.body


    if (!ObjectID.isValid(req.params.id))   // si lID est connu dans la base de donner

        return res.status(400).send('ID unknown :' + req.params.id);

    console.log(req.params.id)

    try {

        await CollectionAgency.findByIdAndUpdate(

            req.params.id,

            {
                $set: {
                    isconnected: isconnected, colorIsConnected: colorIsConnected
                }
            }, // najouti fel lista normalement 
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

//////////////////////////////////

exports.deleteagencyCollection = async (req, res) => {

    if (ObjectID.isValid(req.params.id)) {   // si lID est connu dans la base de donner

        // return res.status(400).send('ID unknown :' + req.params.id);


        await CollectionAgency.findByIdAndRemove(req.params.id);
        res.send("deleted");
    }
    else res.send("not found");

}


///////////////////////////////////////////////


exports.signinAdminController = (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    console.log(errors)

    if (!errors.isEmpty()) {                           // express-validator maantha ay haja hors eli hatitha enty
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {

        // check if user exist
        AdminModel.findOne({
            email
        }).exec((err, user) => {
            if (err || !user) {

                return res.status(400).json({
                    errors: 'Admin with that email does not exist. Please signup'
                });
            }


            // generate a token and send to client
            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            );
            const { _id, firstName, lastName, role, picture, city, country, address, phoneNumber, email, location } = user;

            return res.json({
                token,
                user: {
                    _id,
                    firstName,
                    email,
                    role,
                    lastName,
                    city,
                    country,
                    address,
                    phoneNumber,
                    picture,
                    location
                }
            });
        });

    }

};

///////////////////////////////////////

exports.getMachineById = (req, res) => {

    const id = req.params.id

    console.log(id)

    Machine.findById(id, function(err,docs){ 
        
        if (err){
         
        return res.json({message:err})
    }
    else{
        return res.json({message:docs})
    }
});
}