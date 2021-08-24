
const jwt = require("jsonwebtoken");
const AgencyModel = require('../models/CollectionAgency')


module.exports.checkUser = (req, res, next) => {

  const token = req.cookies.jwt;


  if (token) {

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      // cle token secrete (token_secret) qui permet d'acceder a ce token 


      if (err) {

        console.log(err)
        res.locals.agency = null;

        res.cookie('jwt', '', { maxAge: 1 });

        next();
      } else {

        let agency = await AgencyModel.findById(decodedToken.agency_id);


        res.locals.agency = agency;

        next();


      }
    });

  } else {

    res.locals.agency = null;

    next();

  }
}


module.exports.requireAuth = (req, res, next) => {   // pour verifier est ce quiil ya un token et qui est connecter en ce moment
  
  const token = req.cookies.jwt;

  console.log(req.cookies)

  console.log('hethaaaaaaaa howaa la3eb',token)

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.send(200).json('no token')
      } else {
        console.log(decodedToken.agency_id);
        next();
      }
    });
  } else {
    console.log('No token');
  }
};