// Configurando/criando o servidor
const express = require("express")
const server = express()


// Configurando arquivos estáticos
server.use(express.static('public'))


// Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))


// Configurando conexão com o Banco de Dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'your_database_user',         // Nome de usuário do seu banco de dados
    password: 'your_password',          // Senha do acesso ao seu banco de dados
    host: 'localhost',                  // Host
    port: 5432,                         // Porta
    database: 'your_database_name'      // Nome do seu banco de dados
})


// Configurando a template engine - Nunjuks
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


// Apresentação da página na rota '/'
server.get("/", function(req, res) {
    const hide = 'hide'

    db.query("SELECT * FROM donors ORDER BY id DESC LIMIT 4", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors, hide })
    })
})


server.post("/", function(req, res) {
    // Captura os dados do form
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        const error = "* Todos os campos são obrigatórios"
        const hide = ''
        return res.render("index.html", { error, hide })
    }

    const query = 'INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)'

    db.query(query, [name, email, blood], function(err) {
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })
})


// Ligando o servidor com acesso na porta 3000
server.listen(3000, function() {
    console.log("Iniciei o servidor..")
})