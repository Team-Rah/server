const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new mongoose.Schema({
    owner: {
        type: String,
        ref: "User",
      },
      ownerName: {
        type: String,
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

    endRound: {
        type: Number,
    },
    playerVoted: {
        type: String
    },
    voted: [
        {
            voter: {
                type: String,
                ref: 'User'
            },
            voterUserName: {
                type: String
            },
            candidate: {
                type: String,
                ref: 'User'
            },
            candidateUserName: {
                type: String,
            }
        }
    ],
    players: [
        {
            player: {
                user_id : {type:String,ref: 'User'},
                userName: {type: String}
            },
            status: {type: Boolean, default: true},
            role: {type: String, default: 'villager'},
            abilityCount: {type: Number}
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