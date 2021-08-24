
const { Schema, model } = require("mongoose");


const Reservation = new Schema({


    name: {
        type: String,
        require: true

    },

    city: {

        type: String,
        require: true
    },

    duration: {

        type: String,
        require: true

    },
    email: {

        type: String,
        require: true

    },

    reserved: {

        type: String,
        default: 'Inactive',
        enum: ['Active', 'Inactive']
    }



}

);




module.exports = model("reservation", Reservation);