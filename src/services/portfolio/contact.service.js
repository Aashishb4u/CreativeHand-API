const {Resend} = require('resend');
const nodemailer = require('nodemailer');
const config = require('../../config/config');
const logger = require('../../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
    transport
        .verify()
        .then(() => logger.info('Connected to email server'))
        .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}


const sendPortfolioEmail = async (userEmail, adminMail, emailSubject, bodyForAdmin, bodyForUser) => {
    const resend = new Resend(config.resend_key);
    const result = await resend.batch.send([
        {
            from: 'Creative Hand <contact@creativehand.co.in>',
            to: [userEmail],
            subject: 'Thank you for contacting us!',
            html: bodyForUser.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        },
        {
            from: 'Creative Hand <contact@creativehand.co.in>',
            to: [adminMail],
            subject: emailSubject,
            html: bodyForAdmin.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        }
    ]);

    console.log(result);

    return result;
};

const sendLinkedInEmail = async (userEmail, bodyForUser) => {
    const resend = new Resend(config.resend_key);
    const result = await resend.batch.send([
        {
            from: 'Creative Hand <contact@creativehand.co.in>',
            to: [userEmail],
            subject: 'Potential Fit for Your Team – Aashish Bhagwat’s Portfolio',
            html: bodyForUser.updatedHtmlContent,
            headers: {
                'X-Entity-Ref-ID': config.resend_headers,
            },
            tags: [
                {
                    name: 'category',
                    value: 'confirm_email',
                },
            ],
        }
    ]);

    console.log(result);

    return result;
};


// const sendPortfolioEmail = async (userEmail, adminMail, emailSubject, bodyForAdmin, bodyForUser) => {
//     try {
//         // Send email to admin
//         await resend.emails.send({
//             from: 'Creative Hand <contact@creativehand.co.in>',
//             to: adminMail,
//             subject: emailSubject,
//             html: bodyForAdmin,
//             headers: {
//                 'X-Entity-Ref-ID': 'Jqag5gfP_9esPC2rC7mkQiAUaCV2bQBKK',
//             },
//             tags: [
//                 {
//                     name: 'category',
//                     value: 'contact_form',
//                 },
//             ],
//         });
//
//         // Send confirmation email to user
//         const result = await resend.emails.send({
//             from: 'Creative Hand <contact@creativehand.co.in>',
//             to: userEmail,
//             subject: 'Thank you for contacting us!',
//             html: bodyForUser,
//             headers: {
//                 'X-Entity-Ref-ID': 'Jqag5gfP_9esPC2rC7mkQiAUaCV2bQBKK',
//             },
//             tags: [
//                 {
//                     name: 'category',
//                     value: 'confirm_email',
//                 },
//             ],
//         });
//
//         logger.info('Emails sent successfully');
//         return result;
//     } catch (error) {
//         logger.error('Error sending email:', error);
//         throw new Error('Failed to send email');
//     }
//
// };


module.exports = {
    sendPortfolioEmail,
    sendLinkedInEmail
};
