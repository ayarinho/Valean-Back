
const { Schema, model } = require("mongoose");
const crypto = require('crypto');


const CollectionAgency = new Schema({


    role: {

        type: String,
        default: 'Etatique',
        enum: ['Etatique', 'Prive']
    },

    address: {

        type: String,
    },


    phoneNumber: {
        type: String,
        required: true,

    },

    logo: {
        type: String,

    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },

    hashed_password: {
        type: String,
        required: true
    },
    salt: String,

    resetPasswordLink: {
        data: String,
        default: ''
    },

    machine: {
         
         type:[String]
    }

}

);


// virtual
CollectionAgency
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

// methods
CollectionAgency.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

module.exports = model("agencyCollection", CollectionAgency);

