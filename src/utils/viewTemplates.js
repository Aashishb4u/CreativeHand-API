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
                const data =  {
                    updatedHtmlContent: updatedHtmlContent,
                    outputPath: outputPath
                };
                return resolve(data);
            }
        });
    });
};

module.exports = {
    fetchTemplates
};
