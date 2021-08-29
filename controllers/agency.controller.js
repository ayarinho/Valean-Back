const agencyModel = require('../models/CollectionAgency');

module.exports.getAllAgency = (req, res) => {

    agencyModel.find((err, data) => {

        if (!err)

           return res.status(200).json(data);

        else res.status(401).json({err});
    });


    

}