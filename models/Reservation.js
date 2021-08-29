
const { Schema, model } = require("mongoose");


const Reservation = new Schema({


    name: {
        type: String,
       // require: true

    },

    city: {

        type: String,
       // require: true
    },

    duration: {

        type: String,
      //  require: true

    },
    email: {

        type: String,
      //  require: true

    },

    reserved: {

        type: String,
        default: 'Inactive',
        enum: ['Active', 'Inactive']
    },

    phoneNumber:{

        type: String,
       // require:true
    },
 
    typeOfRenting:{
         
        type:String,
        default: 'Basic',
        enum: ['Basic', 'Standard','Premium']
    }
     



}

);




module.exports = model("reservation", Reservation);