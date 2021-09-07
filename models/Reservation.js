
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

    startDate: {

        type: String,
      //  require: true

    },
    endDate: {

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
    },
    succesMessage:{
      type:String,


    }
     



}

);




module.exports = model("reservation", Reservation);