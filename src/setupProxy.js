const registerParticipant = require('../api/participant-registration');

module.exports = app => {
    app.post('/api/participant-registration', registerParticipant);
};
