const { Router } = require('express');
const router = Router();

const { getUsers, getUserById, registerUser, deleteUser, updateUser } = require('./controller')

//Rota que retorna todos os usuários
router.get('/users', getUsers);
router.get('/getUserById/:id', getUserById);
router.post('/register-user', registerUser);
router.delete('/deleteUser/:id', deleteUser);
router.put('/updateUser/:id', updateUser);

module.exports = router;