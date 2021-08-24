
const { Schema, model } = require("mongoose");
const { isEmail } = require('validator');


const AdminModel = new Schema({



    firstName: {

        type: String,
        required: true
    },
    
     lastName: {

        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        validate: [isEmail],  // elle renvoie isEmail true si il est valid sinon elle renvoie false
        lowercase: true,
        unique: true,
        trim: true,

    },

    role: {

        type: Date,
        default: 'admin',
    },

    birthdate: {

        type: String,
        require:true

    },

    address: {

        type: String,
        require:true
    },

    password: {
        type: String,
        required: true,
        max: 1024,            // en cas de cryptage de password 
        minlength: 6
    },

    phoneNumber: {
        type: String,
        required: true,
        
    },

    picture: {
        type: String,
        require:true 

    },
}

);

module.exports = model("admin", AdminModel);

