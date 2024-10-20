const fs = require('fs');
const path = require('path');

const constants = require('../utils/constants');

const fetchTemplates = (myCondition, businessDetails, userDetails, productDetails) => {
    let filePath = null;
    const businessName = businessDetails.business.businessName;
    const businessId = businessDetails._id;
    const emailAddress = userDetails.email;
    const contactNumbers = businessDetails.business.contactNumbers.map(v => v.number).join(', ');
    const productName = productDetails.productName;
    const productDescription = `${productDetails.productDescription}`;
    const businessLogo = `${constants.creativeHand}`;

    // for local use constants.creativeHandLocal
    const productImagePath = `${constants.creativeHandProduction}${productDetails.productImageUrl}`;
    const businessImagePath = `${constants.creativeHandProduction}${businessDetails.business.businessImageUrl}`;
    const outputPath = path.join(__dirname, '..', 'public', `product-enquiry-${businessId}.png`);
    if (myCondition === 'enquiry') {
        filePath = path.join(__dirname, '..', 'public', 'templates', 'product_enquiry_template.html');
    }

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                let updatedHtmlContent = htmlContent.replace('{{businessName}}', businessName.toString());
                updatedHtmlContent = updatedHtmlContent.replace('{{productName}}', productName);
                updatedHtmlContent = updatedHtmlContent.replace('{{contactNumbers}}', contactNumbers);
                updatedHtmlContent = updatedHtmlContent.replace('{{emailAddress}}', emailAddress);
                updatedHtmlContent = updatedHtmlContent.replace('{{businessLogo}}', businessLogo);
                updatedHtmlContent = updatedHtmlContent.replace('{{productDescription}}', productDescription);
                updatedHtmlContent = updatedHtmlContent.replace('{{productImageUrl}}', productImagePath);
                updatedHtmlContent = updatedHtmlContent.replace('{{businessImageUrl}}', businessImagePath);
                updatedHtmlContent = updatedHtmlContent.replace('{{businessName}}', businessName.toString());
                const data = {
                    updatedHtmlContent: updatedHtmlContent,
                    outputPath: outputPath
                };
                return resolve(data);
            }
        });
    });
};

const fetchAdminTemplate = (userDetails) => {
    let filePath = null;
    const {email, name, phoneNumber, subject, message} = userDetails;
    filePath = path.join(__dirname, '..', 'public', 'templates', 'portfolio_contact.html');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                const todayDate = new Date().getFullYear().toString();
                let updatedHtmlContent = htmlContent.replace('{{email}}', email);
                updatedHtmlContent = updatedHtmlContent.replace('{{name}}', name);
                updatedHtmlContent = updatedHtmlContent.replace('{{phoneNumber}}', phoneNumber);
                updatedHtmlContent = updatedHtmlContent.replace('{{subject}}', subject);
                updatedHtmlContent = updatedHtmlContent.replace('{{message}}', message);
                updatedHtmlContent = updatedHtmlContent.replace('{{todayDate}}', todayDate);
                const data = {
                    updatedHtmlContent: updatedHtmlContent
                };
                return resolve(data);
            }
        });
    });
}

const fetchMailToUserTemplate = (userDetails) => {
    let filePath = null;
    const {name} = userDetails;
    filePath = path.join(__dirname, '..', 'public', 'templates', 'portfolio_user.html');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                const todayDate = new Date().getFullYear().toString();
                let updatedHtmlContent = htmlContent.replace('{{name}}', name);
                updatedHtmlContent = updatedHtmlContent.replace('{{todayDate}}', todayDate);
                const data = {
                    updatedHtmlContent: updatedHtmlContent
                };
                return resolve(data);
            }
        });
    });
}

const fetchLinkedInMailToUserTemplate = () => {
    let filePath = null;
    filePath = path.join(__dirname, '..', 'public', 'templates', 'linkedIn_mail_template.html');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (error, htmlContent) => {
            if (error) {
                reject(error);
            } else {
                const data = {
                    updatedHtmlContent: htmlContent
                };
                return resolve(data);
            }
        });
    });
}

module.exports = {
    fetchTemplates,
    fetchAdminTemplate,
    fetchMailToUserTemplate,
    fetchLinkedInMailToUserTemplate
};
