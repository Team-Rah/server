const {createUser} = require('./dummyDataFunctions');
const User = require ('../database/models/User');
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL)
.then((db) => { 
console.log('connected to mongodb on', db.connections[0].port, 'using', db.connections[0].name)
})
.catch((err) => console.log('server error', err))


const seedDatabase = async(num) => {
    try {
        const users = []
        for (let i = 0; i < num ; i++) {

            const newUser = await User(createUser());
            await newUser.save();
        }
        console.log(`SEEDED ${num} USERS TO DATABASE`)
        mongoose.connection.close();
    }
    catch(err) {
        console.log(err);
        mongoose.connection.close();
    }
};



seedDatabase(50);

