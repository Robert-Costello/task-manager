const secretsObj = require('../../secrets');
const sendGridKey = secretsObj.sendGridKey;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sendGridKey);

sgMail.send({
  to: 'robertedwardcostello@gmail.com',
  from: 'robertedwardcostello@gmail.com',
  subject: 'First Email',
  text: 'Hope this works.',
});
