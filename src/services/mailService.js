const templates = require('../templates/email.templates');
const { sendMail } = require('../config/emailTransport');

const sendEmail = async ({ to, subject, html, text = '' }) => {
    if (process.env.NODE_ENV === 'test') return;

    try {
        const result = await sendMail({ to, subject, html, text });
        console.info(`[Email] Sent to ${to} | subject: "${subject}"`);
        return result;
    } catch (err) {
        console.error(`[Email] Failed to send to ${to}: ${err.message}`);
    }
};

const sendResetPassword = (user, token) => {
    const { subject, html } = templates.resetPassword({ name: user.name, token });
    return sendEmail({
        to: user.email,
        subject,
        html
    });
};

module.exports = {
    sendEmail,
    sendResetPassword
}