const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')
const Usuario = require('./database/Usuario')

//Database
connection.authenticate().then(() => {
    console.log('Conexão feita com o banco de dados!');
}).catch((err) => {
    console.log(err)
})

//Setando no express usar o ejs como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'))

// Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const salt = bcrypt.genSaltSync(10)

// Rotas
app.get('/', (req, res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC']
    ]}).then((perguntas) => {
        res.render('index', {
            perguntas : perguntas
        })
    })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
})

app.post('/salvarpergunta', (req, res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id

    Pergunta.findOne({
        where : {id : id},
        raw   : false
    }).then((pergunta) => {
        if(pergunta != undefined) { // Pergunta achada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                raw: false,
                order: [['id', 'DESC']]
            }).then((respostas) => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else  { // Não encontrada
            res.redirect('/')
        }        
    })
})

app.post('/responder', (req, res) => {
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`)
    })
})

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
})

app.post('/cadastrar', (req, res) => {
    let usuario = req.body.usuario;
    let senha = bcrypt.hashSync(req.body.senha, salt)

    Usuario.create({
        usuario: usuario,
        senha: senha
    })

    res.redirect('/')
})

app.get('/home', (req, res) => {
    Pergunta.findAll({ raw: true, order: [['id', 'DESC']], limit: 6}).then((perguntas) => {
        Resposta.findAll({
            raw: true,
            order: [['id', 'DESC']]
        }).then((respostas) => {
            let perguntasIds = [];
            respostas.forEach(item => {
                perguntasIds.push(item.perguntaId);
            });

            perguntasIds.push(1)
            perguntasIds.push(1)
            perguntasIds.push(1)
            perguntasIds.push(1)
            perguntasIds.push(1)

            Pergunta.findOne({raw: true, where: {id: perguntasIds[0]}}).then((perg1) => {
                Pergunta.findOne({raw: true, where: {id: perguntasIds[1]}}).then((perg2) => {
                    Pergunta.findOne({raw: true, where: {id: perguntasIds[2]}}).then((perg3) => {
                        Pergunta.findOne({raw: true, where: {id: perguntasIds[3]}}).then((perg4) => {
                            Pergunta.findOne({raw: true, where: {id: perguntasIds[4]}}).then((perg5) => {
                                Pergunta.findOne({raw: true, where: {id: perguntasIds[5]}}).then((perg6) => {
                                    let respostas = [perg1, perg2, perg3, perg4, perg5, perg6];
                                    res.render('home', {
                                        novasPerguntas: perguntas,
                                        novasRespostas: respostas
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})

app.listen(3000, () => {
    console.log('App Rodando ...');
})