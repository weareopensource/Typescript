import * as mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import chalk from 'chalk';
import * as mongooseService from '../../lib/services/mongoose';
import config from '../../config';

// @ts-ignore
const transporter = nodemailer.createTransport(config.mailer.options);
const link = 'reset link here'; // PUT reset link here
const email = {
  to: '',
  text: '',
  html: '',
  from: config.mailer.from,
  subject: 'Security update',
};
const text = [
  'Dear {{name}},',
  '\n',
  'We have updated our password storage systems to be more secure and more efficient, please click the link below to reset your password so you can login in the future.',
  link,
  '\n',
  'Thanks,',
  'The Team',
].join('\n');

async function start() {
  await mongooseService.connect();
  await mongooseService.loadModels();

  const User = mongoose.model('User');

  User.find().exec((mongooseErr, users) => {
    if (mongooseErr) throw mongooseErr;

    let processedCount = 0;
    let errorCount = 0;
    // report the processing results and exit
    function reportAndExit() {
      const successCount = processedCount - errorCount;

      console.log();

      if (processedCount === 0) console.log(chalk.yellow('No users were found.'));
      else {
        let alert;
        if (!errorCount) {
          alert = chalk.green;
        } else if ((successCount / processedCount) < 0.8) {
          alert = chalk.red;
        } else {
          alert = chalk.yellow;
        }

        console.log(alert(`Sent ${successCount} of ${processedCount} emails successfully.`));
      }

      process.exit(0);
    }

    function emailCallback(user) {
      return (err) => {
        // eslint-disable-next-line no-plusplus
        processedCount++;

        if (err) {
          // eslint-disable-next-line no-plusplus
          errorCount++;

          if (config.mailer.options.debug) console.log('Error: ', err);
          console.error(`[${processedCount}/${users.length}] ${chalk.red(`Could not send email for ${user.displayName}`)}`);
        } else {
          console.log(`[${processedCount}/${users.length}] Sent reset password email for ${user.displayName}`);
        }

        if (processedCount === users.length) return reportAndExit();
      };
    }

    function sendEmail(user) {
      email.to = user.email;
      // eslint-disable-next-line no-multi-assign
      email.text = email.html = text.replace('{{name}}', user.displayName);

      transporter.sendMail(email, emailCallback(user));
    }

    // report and exit if no users were found
    if (users.length === 0) return reportAndExit();

    users.forEach((user) => {
      sendEmail(user);
    });
  });
}

start().then((r) => r);
