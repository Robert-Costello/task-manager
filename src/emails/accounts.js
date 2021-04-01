const {sendGridKey} = require('../../secrets');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sendGridKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'appemail@email.com',
    subject: 'Welcome!',
    text: `Welcome to the app, ${name}!`,
  });
};

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'appemail@email.com',
    subject: `Sorry to see you go, ${name}!`,
    text: `Please let us know how we could have made your experience better.`,
  });
};

module.exports = {sendWelcomeEmail, sendGoodbyeEmail};
