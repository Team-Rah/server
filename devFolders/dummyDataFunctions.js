const { faker } = require('@faker-js/faker');

module.exports = {
    createPlayer: (num) => {
      const players = [];
      for (let i = 0; i < num; i++){
        const randomName = faker.name.firstName();
        players.push(randomName);
      }
      return players;
    },
    createUser: () => {
        const user = {
            userName:faker.name.firstName(),
            email: faker.internet.email(),
            password: 'PassWord123!!',
            img: faker.image.avatar(),
        };
        return user;
    },
};
