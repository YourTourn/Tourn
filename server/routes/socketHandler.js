require('babel-register');
const INITIAL_STATE = require('../../data/state.jsx');
const stateGenerator = require('../stateGenerator.js');
const tournaments = require('../models/tournaments.js');
const users = require('../models/users.js');

module.exports.socket = function socketAttachment(io) {
  io.on('connection', (socket) => {
    if (socket.request && socket.request.user) {
    // No need for this event.
    // Client automatically will receive logged state
    // when server detects user is logged in
    // Server will push down LoggedIn initial state when this
    // happens
      console.log(socket.request.user);
      socket.join(socket.request.user._id);

      stateGenerator.generateUserState(socket.request.user._id)
        .then((state) => {
          console.log(state);
          socket.emit('set_state', state);
        });


      // Client submits newly created tournament data,
      // Server adds tournament to db,
      // Send that user the updated state with:
      //   User's tournament list updated with new tourn ID,
      //   User's isOrganizer property set to TRUE,
      //   User's tournament object updated with new tourn ID
      socket.on('new_tourn', (data) => {
        console.log('new_tourn', data);
        tournaments.create(
          socket.request.user._id,
          data.entry.name,
          data.entry.type,
          data.entry.rules
        )
        .then((result) => {
          socket.emit('new_tourn_success', {
            info: {
              tournId: result._id,
              tournName: result.name,
              tournType: result.type,
              rules: result.rules,
            },
            tournStatus: result.tournStatus,
            tournWinner: result.tournWinner,
            roster: result.roster,
            bracket: {
              bracketSize: result.roster.length,
              matches: result.matches,
            },
          });
          socket.join(result._id);
        })
        .catch((err) => {
          console.log('Tournament creation error: ', err);
          socket.emit('new_tourn_fail');
        });
      });

      // Client submits ID of tournament they want to view
      // Server retrieves latest state of that tournament from db
      // Server sends back new tournament object
      socket.on('select_tourn', (data) => {
        console.log('select_tourn', data);
        socket.join(data.entry.tournId);
        tournaments.findById(data.entry.tournId)
          .then((result) => {
            console.log('tourn result', result);
            if (result) {
              socket.emit('select_tourn_success', result);
            } else {
              socket.emit('select_tourn_fail', 'doesnt exist');
            }
          });
      });

      // Client sends ID of alert they want deleted
      // Server updates user's alert list in db with alert removed
      // Server sends back new user data with alert list updated
      socket.on('delete_alert', (data) => {
        console.log('delete_alert', data);
        users.deleteAlert(socket.request.user._id, data.entry.alertid)
          .then(() => {
            socket.emit('delete_alert_success');
          })
          .catch(() => {
            socket.emit('delete_alert_fail');
          });
      });

      // Client (tournament organizer) sends tourn ID, matchIndex, and winner
      // Server does the following:
      //   Validates that user is the organizer and calculates next match
      //   Updates bracket for that tournament in db
      // Server sends back new tournament state to all users
      socket.on('update_bracket', (data) => {
        console.log('update_bracket', data);
        tournaments.advancePlayer(data.entry.tournId, data.entry.winner, data.entry.matchIndex)
        .then(() => {
          socket.emit('update_bracket_success');
          io.to(data.to).emit('advance_player',
            {
              tournId: data.entry.tournId,
              winner: data.entry.playerId,
              matchIndex: data.entry.matchIndex,
            });
        })
        .catch(() => {
          socket.emit('update_bracket_fail');
        });
      });

      // Client sends ID of tournament they wish to accept an invite to
      // Server does the following:
      //   Adds user to tournament roster
      //   Adds tournament to front of user's tourn list
      // Server sends the user the updated state including new tourn list and tournament
      // Server sends all users in that tournament a chat message noting the user accepted
      // Server sends new roster to all users in that tournament
      socket.on('accept_invite', (data) => {
        console.log('accept_invite', data);
        users.acceptInvite(socket.request.user._id, data.entry.alertid)
          .then((result) => {
            tournaments.addRosterPlayer(result.tournId, socket.request.user._id)
              .then(() => {
                socket.emit('accept_invite_success', { tournId: result.tournId });
                io.to(data.to).emit('roster_update');
              })
              .catch(() => {
                socket.emit('accept_invite_fail');
              });
          })
          .catch(() => {
            socket.emit('accept_invite_fail');
          });
      });

      socket.on('send_invite', (data) => {
        console.log('send_invite', data);

        users.createAlert(data.entry.userId, data.entry.tournId, true, data.entry.message)
        .then(() => {
          io.to(data.entry.userId).emit('update_alert',
            {
              tournId: data.entry.tournId,
              message: 'Invited to a tournament!',
              isInvite: true,
            });
        })
        .catch(() => {
          socket.emit('send_invite_fail');
        });
      });

      socket.on('start_tourn', (data) => {
        console.log('start_tourn', data);
        // Flip a switch on the tourn, if user is the organized
        tournaments.startTourn(data.entry.tournId)
        .then(() => {
          socket.emit('start_tourn_success');
        })
        .catch((err) => {
          console.log('Start tourn error: ', err);
          socket.emite('start_tourn_fail');
        });
      });

      socket.on('submit_chat', (data) => {
        console.log('submit_chat', data);
        tournaments.addChatMessage(
          data.entry.tournId,
          socket.request.user._id,
          socket.request.user.name,
          data.entry.message,
          data.entry.timeStamp)
        .then(() => {
          socket.emit('submit_chat_success');
          io.to(data.to).emit('chat_message', {
            authorId: socket.request.user._id,
            authorName: socket.request.user.name,
            message: data.entry.message,
            timeStamp: data.entry.timeStamp,
          });
        })
        .catch((err) => {
          console.log('Submit chat error', err);
          socket.emit('submit_chat_fail');
        });
      });
    }
  });
};

// send_invite
// Client sends a tournId and a user name to send an invite to
// Server matches name against the user db.
// If there is a match, add a new alert to the invited user's
// alerts list.
// Server sends back a new user state to the invited user with
// updated alert list.
//

// start_tourn
// Client sends the tournId of tournament to begin
// Server updates tournament state in DB
// Server sends back success message to all players in tourn

// submit_chat
// Client sends the new chat message in the form of:
// {
//   tournId: null,  // id of tournament that message is addressed to
//   message: '',    // user message string
//   timeStamp: '',  // time message was generated
// }
// Server adds new message to the tournament's chat history
// Server sends new chat history to all players in tourn
