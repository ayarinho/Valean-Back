const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { connect } = require('mongoose');
const { success, error } = require('consola');
const cookieParser = require('cookie-parser');
const { checkUser, requireAuth } = require('./middleware/auth-middelware');
var  fileUpload = require('express-fileupload');

require("dotenv").config({ path: './config/.env' });

const app = express();

app.use(fileUpload({
   
      useTempFiles:true
      
}))

const corsOptions = {
     origin: process.env.CLIENT_URL,
     credentials: true,
     'allowedHeaders': ['sessionId', 'Content-Type'],
     'exposedHeaders': ['sessionId'],
     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
     'preflightContinue': false
}

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }))

var jsonParser = bodyParser.json();

// parse application/json
app.use(bodyParser.json({ type: 'application/*+json' }))
//use router middelware

app.use('/api/agencyCollection', jsonParser, require('./routes/CollectionAgency'));


app.use(cookieParser()),



     //middelware

     app.get('*', checkUser);                         // "*" ca veut dire n'importe quelle route alors tu va declencher la methode check pour voir token middelware egale security et connexion de notre utilisateur

app.get('/jwtid', requireAuth, (req, res) => {      // pour verifier qui est connecter tawaa li yabda fama 3 el westani c'est un middelware

     res.status(200).json(res.locals.agency)
});



const startApp = async () => {
     try {
          // Connection With DB
          await connect(process.env.APP_DB, {
               useFindAndModify: true,
               useUnifiedTopology: true,
               useNewUrlParser: true
          });

          success({
               message: `Successfully connected with the Database \n${process.env.APP_DB}`,
               badge: true
          });

          // Start Listenting for the server on PORT
          app.listen(process.env.PORT, () =>
               success({ message: `Server started on PORT ${process.env.PORT}`, badge: true })
          );
     } catch (err) {
          error({
               message: `Unable to connect with Database \n${err}`,
               badge: true
          });
          startApp();
     }
};

startApp();




