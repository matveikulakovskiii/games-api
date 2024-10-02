const express = require('express')
const cors = require('cors')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require("yamljs")
const swaggerDocument = yamljs.load('./docs/swagger.yaml')

app.use(cors())
app.use(express.json())

const games = [
    {id: 1, name: "Witcher 3", price: 29.99},
    {id: 2, name: "Cyberpunk 2077", price: 59.99},
    {id: 3, name: "Minecraft", price: 26.99},
    {id: 4, name: "CSGO", price: 0},
    {id: 5, name: "Roblox", price: 0},
    {id: 6, name: "GTA V", price: 29.99},
    {id: 7, name: "Valorant", price: 0},
    {id: 8, name: "WoW", price: 11.99},
]

app.get('/games', (req, res) => {
    res.send(games)
})

app.get('/games/:id', (req, res) => {
    res.send(games[req.params.id - 1])
})

app.post('/games', (req, res) => {
    if (!req.body.name || !req.body.price){
        return res.status(400).send({error: 'One or all params are missing'})
    }
    let game = {
        id: games.length + 1,
        price: req.body.price,
        name: req.body.name
    }

    games.push(game)

    res.status(201)
        .location('${getBaseUrl(req)}/games${games.length}')
        .send(game)
})

app.delete('/games/:id',(req, res) => {
    if (typeof games[req.params.id -1] === 'undefined'){
        return res.status(404).send({error: "Game not found"})
    }

    games.splice(req.params.id -1, 1)

    res.status(204).send({error:"No content"})
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req){
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + '://${req.headers.host}'
}

app.put('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const gameIndex = games.findIndex(game => game.id === gameId);

    if (gameIndex === -1) {
        return res.status(404).send({error: 'Game not found'});
    }

    // Обновляем только имя и цену игры
    if (req.body.name) {
        games[gameIndex].name = req.body.name;
    }
    if (req.body.price !== undefined) {
        games[gameIndex].price = req.body.price;
    }

    res.send(games[gameIndex]);
});