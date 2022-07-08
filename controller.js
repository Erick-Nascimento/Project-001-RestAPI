const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit')

const pool = new Pool({
    user: "admin",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "fastapi"
})

const rateLimiter = rateLimit({
	max: 3,
    windowMs: 1*60 *1000
})

//INITIAL ROUTE
const initialRoute = async (req, res) => {
    res.send('Seja muito bem-vindo ao projeto de uma API REST desenvolvido por Erick Nascimento')
};

//SELECT ALL USERS
const getUsers = async (req, res) => {
    const response = await pool.query('SELECT * FROM users');
    res.status(200).json(response.rows)
};

//SELECT BY ID
const getUserById = async (req, res) => {
    const response = await pool.query(`SELECT * FROM users WHERE id = ${req.params.id}`)
    res.status(200).json(response.rows)
};

//INSERT
const registerUser = async (req, res) => {
    const { name, cpf , email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10)
    const response = await pool.query(`INSERT INTO users("name", "cpf", "email", "password") VALUES ('${name}', '${cpf}', '${email}', '${hashPassword}')`)
    res.json({
        message: 'Usuário criado com sucesso!',
        body:{
            user: {name, cpf, email, password}
        }
    })
};

//DELETE
const deleteUser = async (req, res) => {
    const id = req.params.id
    const response = await pool.query(`DELETE FROM users WHERE id = ${id}`)
    res.json(`Usuário ${id} deletado com sucesso!`)
};

//UPDATE
const updateUser = async (req, res) => {
    const id = req.params.id;
    const {name, cpf, email, password} = req.body;
    
    const response = await pool.query('UPDATE users SET name=$1, cpf=$2 , email=$3, password=$4 WHERE id=$5', [
        name,
        cpf,
        email,
        password,
        id
    ]);
    res.json(`Usuário ${id} atualizado com sucesso`)
};

//UPDATE PARTIALLY
const updateUserPartially = async (req, res) => {
    const id = req.params.id;
    const {columnName, value} = req.body;
    const response = await pool.query(`UPDATE users SET ${columnName} = '${value}' WHERE id = ${id}`);
    res.json(`Usuário ${id} atualizado com sucesso`)
};

const userLogin = async (req, res, next) => {
    const SECRET = 'password'
    const {email, password} = req.body;

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
   
    if (result.rows.length == 1){

        await bcrypt.compare(password, result.rows[0].password, function(err, resultado){           
            if(err){
                res.status(401).send({message: 'Usuário não autenticado'})
            }
            if(resultado){
                const token = jwt.sign({}, SECRET, {expiresIn: 300});
                return res.status(200).send({message: 'Usuário autenticado com sucesso!', auth: true, token})
            }
            res.status(401).send({message: 'Usuário não autenticado'})
        })
    }else{
        res.json({message: 'Usuário não autenticado'})
    }

};

const protectedRoute = async (req, res) => {
    const SECRET = 'password'
    const token = req.headers['x-access-token'];
    
    jwt.verify(token, SECRET, (err, decoded)=> {
        if(err) return res.status(401).send({message: 'Usuário não autenticado'})

        if(decoded) return res.json({message: 'Bem vindo a rota protegida!'})
    })

};


module.exports = {
    initialRoute,
    getUsers,
    registerUser,
    getUserById,
    deleteUser,
    updateUser,
    updateUserPartially,
    userLogin,
    protectedRoute,
    rateLimiter
}