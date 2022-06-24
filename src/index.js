//Biblioteca responsável pela conexão com o postgree
const Client = require('pg').Client

//USANDO EXPRESS
const express = require('express');

//CRIAR O APP
const app = express();

//APLICAR MIDDLEWARES
app.use(express.json())

//MANDAR O SERVIDOR RODAR
app.listen(3333, () => console.log("Server is running"));

//JWT
const jwt = require('jsonwebtoken');
//jwt.sign({payload}, secret, {opcoes})

//SELECT
//getUsers()
async function getUsers(){
    const cliente = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "API_REST_PROJECT"
    })
    try{
        console.log("Iniciando a conexão.")
        await cliente.connect() //Inicia a conexão
        console.log("Conexão bem sucedida!")
        const resultado = await cliente.query("SELECT * FROM library.user") //Executa a query SQL
        console.table(resultado.rows)
    }catch(ex){
        console.log("Ocorreu um erro. Erro: " + ex)
    }finally{
        await cliente.end() //Encerra a conexão
        console.log("Conexão encerrada!")
    }
}

//INSERT
//insertUsers("Glaucia", "151.326.147-52")
async function insertUsers(name, cpf){
    const cliente = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "API_REST_PROJECT"
    })
    console.log('Chamou a funcao')
    try{
        console.log("Iniciando a conexão.")
        await cliente.connect()
        console.log("Conexão bem sucedida!")
        //await cliente.query('insert into library.user("name", "cpf") values ('+"'"+name+"', '"+cpf+"');")
        await cliente.query(`INSERT INTO library.user("name", "cpf") VALUES ('${name}', '${cpf}')`)
        console.log("Valor inserido na tabela")

        const resultado = await cliente.query("SELECT * FROM library.user")
        console.table(resultado.rows)
    }catch(ex){
        console.log("Ocorreu um erro. Erro: " + ex)
    }finally{
        await cliente.end()
        console.log("Conexão encerrada!")
    }
}

//DELETE
//deleteUser(5)
async function deleteUser(id){
    const cliente = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "API_REST_PROJECT"
    })
    try{
        id = id.id
        console.log("Iniciando a conexão.")
        await cliente.connect()
        console.log("Conexão bem sucedida!")
        await cliente.query(`DELETE FROM library.user WHERE id = ${id}`)
        console.log("Valor inserido na tabela")

        const resultado = await cliente.query("SELECT * FROM library.user")
        console.table(resultado.rows)
        
    }catch(ex){
        console.log("Ocorreu um erro. Erro: " + ex)
    }finally{
        await cliente.end()
        console.log("Conexão encerrada!")
    }
}

//UPDATE
//updateUser('name', 'Alberto', 6)
async function updateUser(columnName, value, id){
    const cliente = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "API_REST_PROJECT"
    })
    try{
        console.log(columnName, value, id)
        console.log("Iniciando a conexão.")
        await cliente.connect()
        console.log("Conexão bem sucedida!")
        await cliente.query(`UPDATE library.user SET ${columnName} = '${value}' WHERE id = ${id}`)
        console.log("Valor inserido na tabela")

        const resultado = await cliente.query("SELECT * FROM library.user")
        console.table(resultado.rows)
        
    }catch(ex){
        console.log("Ocorreu um erro. Erro: " + ex)
    }finally{
        await cliente.end()
        console.log("Conexão encerrada!")
    }
}

const SECRET = 'Erick';

//Rota para cadastro de usuário
app.post("/register-user", (req, res) => {
    const { name, cpf } = req.body;
    const user = { name, cpf };
    //books.push(book);
    const token = jwt.sign({}, SECRET, {expiresIn: 300});
    insertUsers(name, cpf)
    return res.status(201).json({auth: true, token});
});

//Rota para listar todos os usuários
app.get("/users", (req, res) => {
    const allUsers = getUsers()
    return res.status(200).json(allUsers);
});

//Rota para deletar usuário
app.delete("/deleteUser/:id", (req, res) => {
    const { id } = req.params;
    const user_id = {id}
    deleteUser(user_id)
    //return res.sendStatus("Usuário deletado com sucesso!")
    //return res.status(204).send("Usuário deletado com sucesso!")
    return res.status(204).json("Usuário deletado com sucesso!");
})

//Rota de update
app.patch("/updateUser/:id", (req, res) => {
    const {columnName, value} = req.body;
    const { id } = req.params;
    updateUser(columnName, value, id)
    //const book = books.find(book => book.id === book_id);
    //id = user.id;
    //book.title = title ? title : book.title;
    //book.author = author ? author : book.author;
    //book.publishedAt = publishedAt ? publishedAt : book.publishedAt;
    return res.status(200).json("Nome atualizado");
});