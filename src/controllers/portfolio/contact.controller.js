const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { contactService } = require('../../services/portfolio');
const { handleSuccess } = require('../../utils/SuccessHandler');
const templateService = require('../../utils/viewTemplates');
const fetch = require('node-fetch');
const {Headers} = require('node-fetch');
const linkedInEmail = require('../../models/linkedInEmail.model'); // Assume you have a model to track sent emails

global.fetch = fetch;
global.Headers = Headers;

const sendEmail = catchAsync(async (req, res) => {
    const {userEmail, adminMail, emailSubject, bodyForAdmin, bodyForUser} = await generateEmail(req.body);
    const verifyEmail = await contactService.sendPortfolioEmail(userEmail, adminMail, emailSubject, bodyForAdmin, bodyForUser);
    handleSuccess(httpStatus.OK, {verifyEmail}, 'Email Sent Successfully.', req, res);
});

const sendLinkedInEmail = catchAsync(async (req, res) => {
    const {userEmail, bodyForUser} = await generateLinkedInEmail(req.body);

    // Check if email was already sent to user
    const existingEmail = await linkedInEmail.findOne({ email: userEmail });
    if (existingEmail) {
        handleSuccess(httpStatus.OK, {userEmail}, 'Email Already Sent.', req, res);
    } else {
        const verifyEmail = await contactService.sendLinkedInEmail(userEmail, bodyForUser);
        handleSuccess(httpStatus.OK, {verifyEmail}, 'Email Sent Successfully.', req, res);
    }
});

const generateEmail = async ({ email, name, phoneNumber, subject, message }) => {
    const adminMail = 'aashishbhagwat4u@gmail.com';
    const emailSubject = `Contact Form Submission: ${subject}`;
    const bodyForAdmin = await templateService.fetchAdminTemplate({email, name, phoneNumber, subject, message})
    const bodyForUser = await templateService.fetchMailToUserTemplate({email, name, phoneNumber, subject, message})
    console.log(bodyForAdmin);
    console.log(bodyForUser);
    return { userEmail: email, adminMail, emailSubject, bodyForAdmin, bodyForUser };
};

const generateLinkedInEmail = async ({ email }) => {
    const bodyForUser = await templateService.fetchLinkedInMailToUserTemplate()
    console.log(bodyForUser);
    return { userEmail: email, bodyForUser };
};

module.exports = {
    sendEmail,
    sendLinkedInEmail
};
