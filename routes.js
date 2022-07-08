const { Router } = require('express');
const router = Router();

const { initialRoute, getUsers, getUserById, registerUser, deleteUser, updateUser, updateUserPartially, userLogin, protectedRoute } = require('./controller')

router.get('/', initialRoute)
router.get('/users', getUsers);
router.get('/getUserById/:id', getUserById);
router.post('/register-user', registerUser);
router.delete('/deleteUser/:id', deleteUser);
router.put('/updateUser/:id', updateUser);
router.patch('/updateUserPartially/:id', updateUserPartially)
router.post('/login', userLogin)
router.post('/protectedRoute', protectedRoute)

module.exports = router;