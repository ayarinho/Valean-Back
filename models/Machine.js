const { Schema, model } = require("mongoose");


const Machine = new Schema({

    longitude: {

        type: Number,
        require: true

    },

    latitude: {
        type: Number,
        require: true
    },

    location: {

        type: String,
        require: true
    },

    picture: {

        type: String,
    },
    color: {

        type: String,
        require: true

    },

    reservation: {

        type: [
            { 
            id: String, 
            name: String, 
            reserved: String 
           }
        ]
    }

}

);




module.exports = model("machine", Machine);

