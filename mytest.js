const Game = require('./database/models/Game')
const {createGame, editGame} = require('./database/controller/games')

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL)
.then((db) => { 
console.log('connected to mongodb on', db.connections[0].port, 'using', db.connections[0].name)
})
.catch((err) => console.log('server error', err))

// const gg = async() => {

//     const game = await Game({gameName:'daves', playerAllowed: 5})
//     await game.save()

// }

// gg()
const update = async() => {
    const find = await Game.findById('627d1c4de0148ca75238ceb1')
    find.voted = []
    const savedGame = await editGame(find)
    return savedGame
}

const ff = async () => {
    const aa= await update()
    console.log(aa)
}

ff()