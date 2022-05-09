// const {} = require('../../helperFN/roles');


function sum(a, b) {
    return a + b;
  }

describe('Roles Test', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
      });
})
