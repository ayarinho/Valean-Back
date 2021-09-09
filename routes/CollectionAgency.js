
const router = require('express').Router();
const { registerController, activationController, signinController, forgotPasswordController, googleController,
     resetPasswordController, getAllUsers, facebookController, addAdmin, getAdmin, updateAdminProfile,
     updateIsConnected, deleteagencyCollection, signinAdminController, getMachineById ,updateIsConnectedAdmin} = require('../controllers/auth.controller');
const { validSign, validLogin, forgotPasswordValidator, resetPasswordValidator } = require('../helpers/valid');
const { uploadProfil, uploadCloudinary, setPhotoCloudinary } = require('../controllers/upload.controller');
const multer = require('multer');
const { reservationController, addMachine, getAllMachine, addMachineToAgencyCollection,
     getReservation, getAllReservation, putMachineReserved, confirmReservation,
     addReservationToMachine } = require('../controllers/reservation.controller');
const { addTrash, addTrashToMachine } = require('../controllers/trash.controller');
const { getEmails } = require('../controllers/clientMessagerie.controller');
const upload = multer();

router.post('/register', validSign, registerController)
router.post('/activation', activationController)
router.post('/login', validLogin, signinController)
router.put('/forgotpassword', forgotPasswordValidator, forgotPasswordController);
router.put('/resetpassword', resetPasswordValidator, resetPasswordController);
router.post('/googlelogin', googleController)
router.post('/facebooklogin', facebookController)
router.get('/getAllUsers', getAllUsers);
router.post('/addAdmin', addAdmin)
router.get('/getAdmin', getAdmin)
router.patch('/updateAdminProfile/:id', updateAdminProfile);
router.patch('/updateIsConnected/:id', updateIsConnected)
router.delete('/deleteagencyCollection/:id', deleteagencyCollection)
router.post('/loginAdmin', signinAdminController)

///
router.post('/reservation', reservationController)
router.get('/getReservation', getReservation)
router.get('/getAllReservation', getAllReservation)
router.post('/confirmReservation', confirmReservation)


///
router.post('/addMachine', addMachine)
router.get('/getAllMachine', getAllMachine)
router.patch("/addMachineToAgency/:id", addMachineToAgencyCollection);   // pour mettre a jour 
router.patch("/addReservationToMachine/:idMachine", addReservationToMachine);
router.get('/getMachineById/:id', getMachineById)

//
router.patch("/putMachineReserved/:idMachine", putMachineReserved);   // pour mettre a jour 

///

router.post('/upload1', uploadCloudinary)
router.post('/setPhotoCloudinary/:id', setPhotoCloudinary)

router.post('/upload', upload.single('file'), uploadProfil) // ki yabda fama 3 el westani c'est un middalware

///

router.post('/addTrash', addTrash);
router.patch('/addTrashToMachine/:id', addTrashToMachine)

//

router.get('/getEmails',getEmails)
router.post('/updateIsConnectedAdmin/:id', updateIsConnectedAdmin)


module.exports = router;
