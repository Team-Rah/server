const {wolfCheck, doctorCheck, seerCheck, wolfKills} = require('../../helperFN/roles');


describe('Checks the validity of roles with night actions', () => {

    test('Returns an array of players that have been attacked by a wolf', () => {
      let sampleVoters = [
        {
          voter: 'cihad',
          candidate: 'josh'
        },
        {
          voter: 'tony',
          candidate: 'josh'
        },
        {
          voter: 'david',
          candidate: 'tony'
        },
      ];

      let samplePlayers = [
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
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'josh', userName:'josh'},
          status: true,
          role: 'villager',
        },
      ];

      expect(wolfKills(sampleVoters, samplePlayers).deaths.length).toBe(2);
      expect(wolfKills(sampleVoters, samplePlayers).players.length).toBe(samplePlayers.length);
    });

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
          candidate: 'josh'
        },
        {
          voter: 'tony',
          candidate: 'josh'
        },
        {
          voter: 'david',
          candidate: 'tony'
        },
      ];

      let samplePlayersSaved = [
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
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'josh', userName:'josh'},
          status: true,
          role: 'villager',
        },
      ];

      let sampleVotersUnsaved = [
        {
          voter: 'cihad',
          candidate: 'josh'
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
          status: true,
          role: 'wolf',
        },
        {
          player: {user_id: 'josh', userName:'josh'},
          status: true,
          role: 'villager',
        },
        {
          player: {user_id: 'random', userName:'random'},
          status: true,
          role: 'villager',
        },
      ];

      let wolfAttack = [
          {
            player: {user_id:'tony', userName: 'tony'},
            status: true,
            role: 'doctor',
          },
          {
            player: {user_id:'josh', userName: 'josh'},
            status: true,
            role: 'villager',
          },
      ];

      expect(doctorCheck(sampleVotersSaved, samplePlayersSaved, wolfAttack).deaths[0].player.user_id).toBe('tony');
      expect(doctorCheck(sampleVotersSaved, samplePlayersSaved, wolfAttack).deaths[1].player.user_id).toBe('josh');

      expect(doctorCheck(sampleVotersUnsaved, samplePlayersUnsaved, wolfAttack).deaths.length).toBe(2);
    });

    test('Checks to see who the seer saw', () => {
      let sampleVoters1 = [
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
      let samplePlayers1 = [
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
        {
          player: {user_id: 'random', userName: 'random'},
          status: true,
          role: 'villager'
        },
      ];
      let sampleVoters2 = [
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
        },
        {
          voter: 'random',
          candidate: 'tony'
        }
      ];
      let samplePlayers2 = [
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
        {
          player: {user_id: 'random', userName: 'random'},
          status: true,
          role: 'seer'
        },
      ];

      expect(seerCheck(sampleVoters1, samplePlayers1)[0].target.player.user_id).toBe('random');
      expect(seerCheck(sampleVoters2, samplePlayers2)[0].target.role).toBe('seer');
      expect(seerCheck(sampleVoters2, samplePlayers2)[1].target.role).toBe('wolf');
    });
});
