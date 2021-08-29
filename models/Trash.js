
const { Schema, model } = require("mongoose");


const Trash = new Schema({



    location: {

        type: String,
        require:true
    },

    state : {
         
        type:String, 
        default:"Empty",
        enum: ['Empty','Not empty ','Full'],
    },
    quantity:{

        type:Number, 
         
    }





}

);




module.exports = model("Trash", Trash);

