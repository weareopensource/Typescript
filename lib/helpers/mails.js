"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const path_1 = tslib_1.__importDefault(require("path"));
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const handlebars_1 = tslib_1.__importDefault(require("handlebars"));
const config_1 = tslib_1.__importDefault(require("../../config"));
const files_1 = tslib_1.__importDefault(require("./files"));
const smtpTransport = nodemailer_1.default.createTransport(config_1.default.mailer.options);
/**
 * @desc Function to send a mail
 */
async function sendMail(mail) {
    const file = await files_1.default(path_1.default.resolve(`./config/templates/${mail.html}.html`));
    const template = handlebars_1.default.compile(file);
    const html = template(mail.text);
    try {
        return await smtpTransport.sendMail({
            from: mail.from,
            to: mail.to,
            subject: mail.subject,
            html,
        });
    }
    catch (err) {
        return `Mail config error, ${err}`;
    }
}
exports.default = sendMail;
//# sourceMappingURL=mails.js.map