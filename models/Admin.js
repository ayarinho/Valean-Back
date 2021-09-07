
const { Schema, model } = require("mongoose");
const { isEmail } = require('validator');


const AdminModel = new Schema({

    userName: {

        type: String,
        required: true
    },

    firstName: {

        type: String,
        required: true
    },
    
     lastName: {

        type: String,
        required: true
    },

    location:{

         type:String,
    },

    email: {
        type: String,
        required: true,
        

    },

    role: {

        type: String,
        default: 'Admin',
    },

    birthdate: {

        type: String,

    },
    
    city: {

        type: String,
        required: true,



    },
    
    country: {

        type: String,
        required: true,


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



module.exports = model("Admin", AdminModel);

