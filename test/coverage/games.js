const {checkIfGamesOver} = require('../../helperFN/games.js');


describe('Checks game helper functions', () => {

  test('test helper function checkIfGamesOver', () => {
    let testGameShouldBeOver = [
      {status: true, role: 'doctor'}, {status: true, role: 'seer'}, {status: false, role: 'wolf'}, {status: false, role: 'villager'},
      {status: true, role: 'villager'}, {status: true, role: 'wolf'}, {status: false, role: 'wolf'}, {status: true, role: 'wolf'},
      {status: true, role: 'wolf'}, {role: 'villager'}, {status: true, role: 'wolf'}, {status: true, role: 'villager'},
      {status: false, role: 'villager'}, {status: false, role: 'wolf'}, {status: false, role: 'villager'}, {status: true, role: 'wolf'}
      ];

      let testWolvesWin = [
        {status: true, role: 'wolf'}, {status: true, role: 'wolf'}, {status: true, role: 'wolf'}, {status: true, role: 'wolf'},
        {status: true, role: 'wolf'}, {status: true, role: 'wolf'}, {status: false, role: 'wolf'}, {status: false, role: 'wolf'},
        {status: false, role: 'wolf'}, {status: false, role: 'wolf'}, {status: false, role: 'wolf'}, {status: false, role: 'wolf'}
      ];

      let testVillagersWin = [
        {status: false, role: 'villager'}, {status: false, role: 'villager'}, {status: false, role: 'villager'}, {status: false, role: 'villager'},
        {status: true, role: 'seer'}, {status: true, role: 'villager'}, {status: true, role: 'villager'}, {status: true, role: 'villager'},
        {status: true, role: 'doctor'}, {status: false, role: 'wolf'}, {status: false, role: 'wolf'}
      ];


    expect(checkIfGamesOver(testGameShouldBeOver).gameOver).toBe(false);
    expect(checkIfGamesOver(testGameShouldBeOver).winner).toBe(null);
    expect(checkIfGamesOver(testWolvesWin).gameOver).toBe(true);
    expect(checkIfGamesOver(testWolvesWin).winner).toBe('wolves');
    expect(checkIfGamesOver(testVillagersWin).gameOver).toBe(true);
    expect(checkIfGamesOver(testVillagersWin).winner).toBe('villagers');
  });
});