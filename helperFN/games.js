module.exports = {
  assignRoles: async (array) => {
    try {
      const roles = ['test1', 'test2', 'test3', 'test4'];
      const numRoles = roles.length - 1;
      const numPlayers = array.length;
      var iterations;
      if (numRoles > numPlayers) {
        iterations = numPlayers - 1;
      } else {
        iterations = numRoles - 1;
      }
      while (iterations >= 0) {
        var position = Math.floor(Math.random() * numPlayers);
        if (array[position]['role'] === 'villager') {
          array[position]['role'] = roles[iterations];
        }
        iterations --;
   }
      return array;
    }
    catch (err) {
      err.statusCode = 500;
      throw Error(err);
    }
  }
}
