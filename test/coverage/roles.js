const {wolfCheck, doctorCheck, seerCheck} = require('../../helperFN/roles');


describe('Checks the validity of roles with night actions', () => {
    test('Wolf did not vote for another wolf', () => {
      let sampleVotersFalse = [
        {
          voter: 'cihad',
          candidate: 'david'
        },
        {
          voter: 'tony',
          candidate: 'david'
        },
        {
          voter: 'david',
          candidate: 'tony'
        }
      ];
      let samplePlayersFalse = [
        {
          player: {user_id: 'tony', userName: 'tony'},
          status: true,
          role: 'doctor',
        },
        {
          player: {user_id: 'cihad', userName: 'cihad'},
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'david', userName: 'david'},
          status: true,
          role: 'wolf'
        },
      ];
      let sampleVotersTrue = [
        {
          voter: 'cihad',
          candidate: 'tony'
        },
        {
          voter: 'tony',
          candidate: 'david'
        },
        {
          voter: 'david',
          candidate: 'tony'
        }
      ];
      let samplePlayersTrue = [
        {
          player: {user_id: 'tony', userName: 'tony'},
          status: true,
          role: 'doctor',
        },
        {
          player: {user_id: 'cihad', userName: 'cihad'},
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'david', userName: 'david'},
          status: true,
          role: 'wolf'
        },
      ];

      expect(wolfCheck(sampleVotersFalse, samplePlayersFalse)).toBe(false);
      expect(wolfCheck(sampleVotersTrue, samplePlayersTrue)).toBe(true);
    });

    test('Doctor saved someone that the wolf/wolves targeted', () => {
      let sampleVotersSaved = [
        {
          voter: 'cihad',
          candidate: 'tony'
        },
        {
          voter: 'tony',
          candidate: 'tony'
        },
        {
          voter: 'david',
          candidate: 'tony'
        }
      ];
      let sampleVotersUnsaved = [
        {
          voter: 'cihad',
          candidate: 'tony'
        },
        {
          voter: 'tony',
          candidate: 'david'
        },
        {
          voter: 'david',
          candidate: 'tony'
        }
      ];
      let samplePlayersSaved = [
        {
          player: {user_id:'tony', userName: 'tony'},
          status: false,
          role: 'doctor',
        },
        {
          player: {user_id: 'cihad', userName: 'cihad'},
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'david', userName:'david'},
          status: false,
          role: 'wolf',
        },
      ];
      let samplePlayersUnsaved = [
        {
          player: {user_id:'tony', userName: 'tony'},
          status: true,
          role: 'doctor',
        },
        {
          player: {user_id: 'cihad', userName: 'cihad'},
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'david', userName:'david'},
          status: false,
          role: 'wolf',
        },
      ];

      expect(doctorCheck(sampleVotersSaved, samplePlayersSaved, 'tony').players.length).toBe(1);
      // expect(doctorCheck(sampleVotersSaved, samplePlayers, 'tony')[0].message).toBe(`Player tony has been healed.`);
      expect(doctorCheck(sampleVotersUnsaved, samplePlayersUnsaved, 'tony').players.length).toBe(0);
      // expect(doctorCheck(sampleVotersUnsaved, samplePlayers, 'tony').message).toBe('No one has been healed.')
    });

    test('Checks to see if seer saw any wolves', () => {
      let sampleVotersFalse = [
        {
          voter: 'cihad',
          candidate: 'tony'
        },
        {
          voter: 'tony',
          candidate: 'random'
        },
        {
          voter: 'david',
          candidate: 'tony'
        }
      ];
      let samplePlayersFalse = [
        {
          player: {user_id: 'tony', userName: 'tony'},
          status: true,
          role: 'seer',
        },
        {
          player: {user_id: 'cihad', userName: 'cihad'},
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'david', userName: 'david'},
          status: true,
          role: 'wolf'
        },
      ];
      let sampleVotersTrue = [
        {
          voter: 'cihad',
          candidate: 'tony'
        },
        {
          voter: 'tony',
          candidate: 'david'
        },
        {
          voter: 'david',
          candidate: 'tony'
        }
      ];
      let samplePlayersTrue = [
        {
          player: {user_id: 'tony', userName: 'tony'},
          status: true,
          role: 'seer',
        },
        {
          player: {user_id: 'cihad', userName: 'cihad'},
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'david', userName: 'david'},
          status: true,
          role: 'wolf'
        },
      ];

      expect(seerCheck(sampleVotersFalse, samplePlayersFalse).length).toBe(0);
      expect(seerCheck(sampleVotersTrue, samplePlayersTrue).length).toBe(1);
    });
});
