const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(`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`);

const sendEmail = (email, subject, message) => {
  const msg = {
      to: email,
      from: 'ashish2.775421@bumc.tu.edu.np',  // Use a verified sender email
      subject: subject,
      text: message,
      html: `<b>${message}</b>`,
  };
  sgMail.send(msg).then(() => {
    console.log("Message sent: %s", info.messageId);
  }).catch((error) => {
      console.error(error);
  });
};



module.exports = sendEmail;