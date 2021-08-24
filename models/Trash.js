
const { Schema, model } = require("mongoose");


const Machine = new Schema({



    location: {

        type: String,
        require:true
    },

    state : {

        require:true,
        enum: ['Vide','Non Vide','Pleine'],
    },





}

);




module.exports = model("trash", Trash);

