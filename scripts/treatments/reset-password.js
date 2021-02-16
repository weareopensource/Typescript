"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const mongooseService = tslib_1.__importStar(require("../../lib/services/mongoose"));
const config_1 = tslib_1.__importDefault(require("../../config"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const transporter = nodemailer_1.default.createTransport(config_1.default.mailer.options);
const link = 'reset link here'; // PUT reset link here
const email = {
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
mongooseService.loadModels();
mongooseService.connect((db) => {
    const User = mongoose_1.default.model('User');
    User.find().exec((err, users) => {
        if (err)
            throw err;
        let processedCount = 0;
        let errorCount = 0;
        // report and exit if no users were found
        if (users.length === 0)
            return reportAndExit(processedCount, errorCount);
        for (let i = 0; i < users.length; i++) {
            sendEmail(users[i]);
        }
        function sendEmail(user) {
            email.to = user.email;
            email.text = email.html = text.replace('{{name}}', user.displayName);
            transporter.sendMail(email, emailCallback(user));
        }
        function emailCallback(user) {
            return (err, info) => {
                processedCount++;
                if (err) {
                    errorCount++;
                    if (config_1.default.mailer.options.debug)
                        console.log('Error: ', err);
                    console.error(`[${processedCount}/${users.length}] ${chalk_1.default.red(`Could not send email for ${user.displayName}`)}`);
                }
                else {
                    console.log(`[${processedCount}/${users.length}] Sent reset password email for ${user.displayName}`);
                }
                if (processedCount === users.length)
                    return reportAndExit(processedCount, errorCount);
            };
        }
        // report the processing results and exit
        function reportAndExit(processedCount, errorCount) {
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
    });
});
//# sourceMappingURL=reset-password.js.map