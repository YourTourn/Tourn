//
// Template state
//
const INITIAL_STATE = {
  mode: 'LoggedOut', // string identifying app mode
                     // modes: LoggedOut, LoggedIn, Edit, Registration
  header: {
    showTournList: false,
    showAlertList: false,
    userData: {
      userId: null, // integer
      facebookId: null, // integer
      userName: '', // string
      userPic: '', // img url string
      alerts: [
        {
          alertId: '1',
          text: 'Bob has advanced in the Ping Pong Tournament', // alert text string
          tournId: '1', // associated tourn id
          isInvite: false, // true if the alert is an invite
        },
        {
          alertId: '2',
          text: 'You have been invited to the Death Game Tournament', // alert text string
          tournId: '2', // associated tourn id
          isInvite: true, // true if the alert is an invite
        },
        {
          alertId: '3',
          text: 'You have been invited to the Coding Challenge Tournament', // alert text string
          tournId: '3', // associated tourn id
          isInvite: true, // true if the alert is an invite
        },
      ],
      userTourns: [
        {
          tournId: '1',
          tournName: 'Ping Pong',
        },
        {
          tournId: '2',
          tournName: 'Death Game',
        },
        {
          tournId: '3',
          tournName: 'Coding Challenge',
        },
      ],  // array of tournaments this user is apart of
    },
  },
  tournament: {
    info: {
      tournId: null, // integer
      tournName: '', // tourn name string
      tournType: '', // tourn type string (single, double, roundrobin)
      isOrganizer: false, // true if the current user is the organizer of this tourn
      rules: '', // organizer defined rules text string
    },
    chat: [
      {
        authorId: null, // id of user who wrote message
        comment: '', // user message string
        timeStamp: '',
      },
    ],
    start: false,
    invite: false,
    roster: [
      {
        playerId: null, // integer
        playerStatus: '', // text determining player's status in tournament
                          // 'Eliminated', 'Match X' where X is the player's active match
        playerName: '', // player name string
        playerPic: '', // player pic url string
      },
    ],
    bracket: {
      bracketSize: null, // bracket size integer set to closest power of 2
      tournStatus: '', // string determining overall tourn states
                       // 'Not Started', 'In Progress', or 'Concluded'
      tournWinner: null, // player object of tournament champion
      matches: [
        {
          player1: {
            userId: null,
            playerName: '',
            playerPic: '',
          },
          player2: {
            userId: null,
            playerName: '',
            playerPic: '',
          },
          winner: null, // set to either player1 or player2 object when match is concluded
          status: '', // string denoting match status
                     // 'In Progress' or 'Concluded'
        },
      ],
    },
  },
};

export default INITIAL_STATE;
