// const {doctor} = require('../../helperFN/roles');


function sum(a, b) {
    return a + b;
  }

describe('Roles Test', () => {
    test('adds 1 + 2 to equal 3', () => {
        const val = []
        const result = []
        expect(doctor(val)).toBe(result);
      });
      test('roles of doctor', () => {
        expect(sum(1, 2)).toBe(3);
      });
})
