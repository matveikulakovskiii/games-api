const express = require('express')
const res = require('express/lib/response')
const req = require('express/lib/request')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require("yamljs")
const swaggerDocument = yamljs.load('./docs/swagger.yaml')

app.use(express.json())

const games = [
    {id: 1, name: "Witcher 3", price: 29.99},
    {id: 2, name: "Cyberpunk 2077", price: 59.99},
    {id: 3, name: "Minecraft", price: 26.99},
    {id: 4, name: "CSGO", price: 0},
    {id: 4, name: "Roblox", price: 0},
    {id: 4, name: "GTA V", price: 29.99},
    {id: 4, name: "Valorant", price: 0},
    {id: 4, name: "WoW", price: 11.99},
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
        .location('${getBaseUrl(req)}/games${games.lemgth}')
        .send(game)
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req){
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + '://${req.headers.host}'
}