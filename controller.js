const { Pool } = require('pg');

const pool = new Pool({
    user: "admin",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "fastapi"
})

//SELECT
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
    const { name, cpf } = req.body;
    const response = await pool.query(`INSERT INTO users("name", "cpf") VALUES ('${name}', '${cpf}')`)
    res.json({
        message: 'Usuário criado com sucesso!',
        body:{
            user: {name, cpf}
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
    const {name, cpf} = req.body;
    
    const response = await pool.query('UPDATE users SET name=$1, cpf=$2 WHERE id=$3', [
        name,
        cpf,
        id
    ]);
    res.json(`Usuário ${id} atualizado com sucesso`)
};


module.exports = {
    getUsers,
    registerUser,
    getUserById,
    deleteUser,
    updateUser
}