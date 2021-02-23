"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = tslib_1.__importStar(require("mongoose"));
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const mongooseService = tslib_1.__importStar(require("../../lib/services/mongoose"));
const config_1 = tslib_1.__importDefault(require("../../config"));
// @ts-ignore
const transporter = nodemailer_1.default.createTransport(config_1.default.mailer.options);
const link = 'reset link here'; // PUT reset link here
const email = {
    to: '',
    text: '',
    html: '',
    from: config_1.default.mailer.from,
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
        if (mongooseErr)
            throw mongooseErr;
        let processedCount = 0;
        let errorCount = 0;
        // report the processing results and exit
        function reportAndExit() {
            const successCount = processedCount - errorCount;
            console.log();
            if (processedCount === 0)
                console.log(chalk_1.default.yellow('No users were found.'));
            else {
                let alert;
                if (!errorCount) {
                    alert = chalk_1.default.green;
                }
                else if ((successCount / processedCount) < 0.8) {
                    alert = chalk_1.default.red;
                }
                else {
                    alert = chalk_1.default.yellow;
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
                    if (config_1.default.mailer.options.debug)
                        console.log('Error: ', err);
                    console.error(`[${processedCount}/${users.length}] ${chalk_1.default.red(`Could not send email for ${user.displayName}`)}`);
                }
                else {
                    console.log(`[${processedCount}/${users.length}] Sent reset password email for ${user.displayName}`);
                }
                if (processedCount === users.length)
                    return reportAndExit();
            };
        }
        function sendEmail(user) {
            email.to = user.email;
            // eslint-disable-next-line no-multi-assign
            email.text = email.html = text.replace('{{name}}', user.displayName);
            transporter.sendMail(email, emailCallback(user));
        }
        // report and exit if no users were found
        if (users.length === 0)
            return reportAndExit();
        users.forEach((user) => {
            sendEmail(user);
        });
    });
}
start().then((r) => r);
//# sourceMappingURL=reset-password.js.map