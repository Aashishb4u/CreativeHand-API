const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { contactService } = require('../../services/portfolio');
const { handleSuccess } = require('../../utils/SuccessHandler');
const templateService = require('../../utils/viewTemplates');
const fetch = require('node-fetch');
const {Headers} = require('node-fetch');

global.fetch = fetch;
global.Headers = Headers;

const sendEmail = catchAsync(async (req, res) => {
    const {userEmail, adminMail, emailSubject, bodyForAdmin, bodyForUser} = await generateEmail(req.body);
    const verifyEmail = await contactService.sendPortfolioEmail(userEmail, adminMail, emailSubject, bodyForAdmin, bodyForUser);
    handleSuccess(httpStatus.OK, {verifyEmail}, 'Email Sent Successfully.', req, res);
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

module.exports = {
    sendEmail
};
