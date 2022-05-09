const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    gameName: {
        type: String,
        required: true,
    },
    playerAllowed: {
        type: Number,
        required: true,
    },
    phase : {
        type: String,
    },
    startRound: {
        type: Number,
    },
    endRound: {
        type: Number,
    },
    voted: [
        {
            voter: {
                type: Schema.Types.ObjectId, ref: "User"
            },
            candidate: {
                type: Schema.Types.ObjectId, ref: "User"
            }
        }
    ],
    players: [
        {
            player: {type: Schema.Types.ObjectId, ref: "User"},
            status: {type: Boolean, default: true},
            role: {type: String, default: 'villager'},
        }
    ],
    winner: {
        type: String,
        default: 'none'
    },
    started: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: () => Date.now(),
    },
});

module.exports = mongoose.model("Game", GameSchema);