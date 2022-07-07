const { Pool } = require('pg');

const pool = new Pool({
    user: "admin",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "fastapi"
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
    const response = await pool.query(`INSERT INTO users("name", "cpf", "email", "password") VALUES ('${name}', '${cpf}', '${email}', '${password}')`)
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


module.exports = {
    initialRoute,
    getUsers,
    registerUser,
    getUserById,
    deleteUser,
    updateUser,
    updateUserPartially
}