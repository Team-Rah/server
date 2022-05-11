const { error } = require('../errorHandler/errorHandler');

module.exports = {
  removeKeyFromArray: async (array, key) => {
    let removedPasswordList = [...array];

    try {
      removedPasswordList.forEach(user => {
        if (user[key]) {
          delete user[key];
        }
      });

      return removedPasswordList;
    }
    catch(err) {
      throw err;
    }
  },
  deleteFriends: async (array, username, removedFriend) => {
    try {
      let removedFriendList = [...array];

      let [specifiedUser] = removedFriendList.filter((user, i) => {
        return user.userName === username;
      });

      let noMoreFriend = specifiedUser.friends.filter(friend => {
        return friend.userName !== removedFriend;
      })

      removedFriendList.forEach(user => {
        if (user.userName === username) {
          user.friends = noMoreFriend;
        }
      })

      return removedFriendList;
    }
    catch(err) {
      throw err;
    }
  },
  addToPlayerScore: async (array, user, score) => {
    try {

      let userList = [...array];

      userList.forEach((player) => {
        if (player.userName === user) {
          if (player.score + score < 0) {
            player.score = 0;
          } else {
            player.score += score;
          }
          return userList;
        }
      });
    }
    catch(err) {
      throw err;
    }
  },

};

