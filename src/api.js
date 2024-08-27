const express = require('express');
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const router = express.Router();

//ROTAS

app.use('/', router.get('/', (req, res, next) => {
    res.status(200).send("<h1>API-CHAT</h1>");
}));

app.use('/', router.get('/sobre', (req, res, next) => {
    res.status(200).send({
        "nome" : "apiChat",
        "autor" : "Vinícius Eduardo Baunhart Wirth",
        "versao" : "0.1.0"
    });
}));

/*app.use('/', router.get('/salas', async (req, res, next) => {
    const salaController = require("./controllers/salaController");
    let resp = await salaController.get();
    res.status(200).send(resp);
}));
*/

//entrar conta
app.use("/entrar", router.post("/entrar", async(req, res, next)=>{
    const usuarioController = require("./controllers/usuarioController.js");
    let resp = await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
}));

//listar salas
app.use("/salas",router.get("/salas", async (req, res,next) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    const test = await token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick);
    console.log(test)
    if(test) {
        let resp = await salaController.get();
        res.status(200).send(resp);
    }else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
})) 

//entrar na sala
app.use("/sala/entrar", router.post("/sala/entrar", async (req, res)=>{
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if(token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)){
        let resp = await salaController.entrar(req.headers.iduser, req.query.idSala);
        res.status(200).send(resp);
    }else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
}));

//enviar mensagem
app.use("/sala/mensagem", router.post("/sala/mensagem", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
    let resp= await salaController.enviarMensagem(req.headers.nick, req.body.mensagem,req.body.idSala);
    res.status(200).send(resp);
}))
  

//lista mensagens
app.use("/sala/mensagens", router.get("/sala/mensagens", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
    let resp= await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
    res.status(200).send(resp);
}))
module.exports = app;