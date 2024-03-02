const router = require('express').Router();

const { 
    allUsers,getUsersById,register,login,update,deleteUsers
} = require('../controllers/users');
const { verifyUser, verifyAdmin } = require('../utils/Verifytoken');

// CREATE NEW USER
router.post('/register', register)
// LOGIN USER
router.post('/login', login)
// UPDATE USER 
router.put('/updateUser/:id',verifyUser, update)
// GET ALL USERS
router.get('/allUsers',verifyAdmin, allUsers)
// router.get('/allUsers', allUsers)
// GET USER BY ID
router.get('/user/:id',verifyUser, getUsersById)
// DELETE USER
router.delete('/deleteuser/:id', verifyUser, deleteUsers)


// // VERIFY TOKEN
// router.get('/checkauth', verifyToken, (req, res, next) => {
//     res.send('you are logged in now and you have the token')
// })
// // CHECKNG THE USER IS AUTHORIZED OR NOT
// router.get('/checkuser/:id', verifyUser, (req, res, next) => {
//     res.send('hello user! you are logged in now and can delete your account')
// })
// // CHECKNG THE ADMIN 
router.get('/checkadmin/:id', verifyAdmin, (req, res, next) => {
    res.send('hello admin! you are logged in now and can delete all account')
})
module.exports = router;