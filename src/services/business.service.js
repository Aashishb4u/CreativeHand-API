const httpStatus = require('http-status');
const {Business, Payment, User} = require('../models');
const {Offer, WebsiteEnquiry, BusinessView} = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require("lodash");
const path = require('path');
const fs = require('fs');

/**
 * Create a business
 * @param {Object} businessBody
 * @returns {Promise<Business>}
 */
const createBusiness = async (businessBody) => {
    const businessDetails = await getBusinessByKeyword(businessBody.keywordUrl);
    if (businessDetails) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Keyword is taken.');
    }
    return Business.create(businessBody);
};

/**
 * Query for businesses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWebsiteEnquiries = async (filter, options) => {
    let enquiries = await WebsiteEnquiry.paginate(filter, options);
    return enquiries;
};

const queryBusinesses = async (filter, options) => {
    // Set the sorting criteria to sort by createdAt in descending order if not provided
    options.sortBy = options.sortBy || 'createdAt:desc';

    // Add the filter for businessName if it is provided
    if (filter.businessName) {
        filter['business.businessName'] = { $regex: filter.businessName, $options: 'i' };
        delete filter.businessName;
    }

    let businesses = await Business.paginate(filter, options);
    businesses.results = await Promise.all(
        businesses.results.map(async (business) => {
            const payments = await Payment.find({ businessId: business._id }).exec();
            const customerDetails = business.customerId ? await User.findOne({ _id: business.customerId }).exec() : null;
            const executiveDetails = business.executiveId ? await User.findOne({ _id: business.executiveId }).exec() : null;
            const offerDetails = business.offerId ? await Offer.findOne({ _id: business.offerId }).exec() : null;
            return {
                ...business._doc,
                payments: payments ? payments : null,
                customerDetails,
                executiveDetails,
                offerDetails,
            };
        })
    );

    return businesses;
};


/**
 * Get business by id
 * @param {ObjectId} id
 * @returns {Promise<Business>}
 */
const getBusinessById = async (id) => {
    return Business.findById(id);
};

const getBusinessByKeyword = async (keyword) => {
    return Business.findOne({keywordUrl: keyword})
        .sort({createdAt: -1}) // Sort by createdAt field in descending order (-1)
        .exec();
};

const getBusinessByLanguage = async (lang) => {
    return Business.findOne({language: lang});
};

const getBusinessProductsById = async (id) => {
    return Business.findOne({_id: id}, {products: 1})
        .select('-_id products')
        .lean()
        .exec();
};

const deletePortfolioImage = async (portfolioIndex, businessId) => {
   const filePaths = await getPortfolioImagesPath(businessId);
    const result = await deleteFiles(filePaths, portfolioIndex, businessId);
    console.log(result);
    if (result && result.length) {
        return await updateBusinessById(businessId, {portfolioImages: result})
    } else {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Portfolio Image not deleted');
    }
};

const deleteFiles = (filePaths, portfolioIndex, businessId) => {
    return new Promise((resolve, reject) => {
        const directory = path.join(__dirname, '..', 'public');
        const fileToDelete = filePaths.find(filePath => {
            const fileName = path.basename(filePath);
            const currentIndex = parseInt(fileName.split('-')[3].split('.')[0]);
            return currentIndex === portfolioIndex;
        });

        if (fileToDelete) {
            fs.unlink(fileToDelete, async err => {
                if (err) {
                    console.error('Error deleting file:', fileToDelete, err);
                    reject(err);
                } else {
                    console.log('File deleted:', fileToDelete);

                    try {
                        const newFilePaths = await getPortfolioImagesPath(businessId);
                        let updatedFilePaths = [];

                        for (const filePath of newFilePaths) {
                            const fileName = path.basename(filePath);
                            const currentIndex = parseInt(fileName.split('-')[3].split('.')[0]);

                            if (currentIndex > portfolioIndex) {
                                const newIndex = currentIndex - 1;
                                const newFileName = fileName.replace(`-${currentIndex}.`, `-${newIndex}.`);
                                const newFilePath = path.join(directory, newFileName);
                                const relativePath = path.relative(directory, newFilePath);

                                await new Promise((resolve, reject) => {
                                    fs.rename(filePath, newFilePath, err => {
                                        if (err) {
                                            console.error('Error renaming file:', filePath, err);
                                            reject(err);
                                        } else {
                                            console.log('File renamed:', filePath, 'to', newFilePath);
                                            resolve();
                                        }
                                    });
                                });

                                updatedFilePaths.push(`public/${relativePath}`);
                            } else {
                                const relativePath = path.relative(directory, filePath);
                                updatedFilePaths.push(`public/${relativePath}`);
                            }
                        }

                        console.log('Updated file paths:', updatedFilePaths);
                        resolve(updatedFilePaths);
                    } catch (err) {
                        console.error('Error getting portfolio images path:', err);
                        reject(err);
                    }
                }
            });
        } else {
            const error = new Error('File not found for deletion');
            console.error(error);
            reject(error);
        }
    });
};

const getPortfolioImagesPath = (businessId) => {
    const directory = path.join(__dirname, '..', 'public');
    const prefix = `business-${businessId}-portfolioImages`;

    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                reject(err);
                return;
            }

            const filePaths = files
                .filter(file => file.startsWith(prefix))
                .map(file => path.join(directory, file));

            resolve(filePaths);
        });
    });
};

const getBusinessPortfolioById = async (id) => {
    return Business.findOne({_id: id}, {portfolioImages: 1})
        .select('-_id portfolioImages')
        .lean()
        .exec();
};

/**
 * Update business by id
 * @param {ObjectId} businessId
 * @param {Object} updateBody
 * @returns {Promise<Business>}
 */
const updateBusinessById = async (businessId, updateBody) => {
    let business = await getBusinessById(businessId);
    if (!business) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
    }

    if (updateBody.business) {
        Object.assign(business.business, updateBody.business);
    }

    if (updateBody.address) {
        Object.assign(business.address, updateBody.address);
    }

    if (updateBody.socialMediaLinks) {
        Object.assign(business.socialMediaLinks, updateBody.socialMediaLinks);
    }

    if (updateBody.bankDetails) {
        Object.assign(business.bankDetails, updateBody.bankDetails);
    }

    if (updateBody.upiPayments) {
        Object.assign(business.upiPayments, updateBody.upiPayments);
    }

    if (updateBody.videoLinks) {
        business.videoLinks = updateBody.videoLinks;
    }

    if (updateBody.portfolioImages && updateBody.portfolioImages.every(value => value !== null)) {
        business.portfolioImages = updateBody.portfolioImages;
    }

    if (updateBody.products) {
        business.products = updateBody.products;
        business.products.productName = updateBody.products.productName;
        business.products.productDescription = updateBody.products.productDescription;
    }

    if (updateBody.specialities) {
        business.specialities = updateBody.specialities;
    }

    if (updateBody.whatsappCatalogue) {
        business.whatsappCatalogue = updateBody.whatsappCatalogue;
    }

    if (updateBody.theme) {
        business.theme = updateBody.theme;
    }

    if (updateBody.template) {
        business.template = updateBody.template;
    }

    if (updateBody.keywordUrl) {
        business.keywordUrl = updateBody.keywordUrl;
    }

    if (updateBody.status) {
        business.status = updateBody.status;
    }

    if (updateBody.language) {
        business.language = updateBody.language;
    }

    if (updateBody.isDemo) {
        business.isDemo = updateBody.isDemo;
    }

    if (updateBody.PaymentStatus) {
        business.PaymentStatus = updateBody.PaymentStatus;
    }

    if (updateBody.currentPaymentId) {
        business.currentPaymentId = updateBody.currentPaymentId;
    }

    if (updateBody.paymentStatus) {
        business.paymentStatus = updateBody.paymentStatus;
    }

    if (updateBody.subscriptionEndDate) {
        business.subscriptionEndDate = updateBody.subscriptionEndDate;
    }

    if (updateBody.subscriptionStartDate) {
        business.subscriptionStartDate = updateBody.subscriptionStartDate;
    }

    await business.save();
    return business;
};

const renderDemoBusiness = async (updateBody) => {
    let language = updateBody.language;
    let business = await getBusinessByLanguage(language);
    if (business.language && business.isDemo) {
        business.theme = updateBody.theme;
        business.template = updateBody.template;
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
    }
    await business.save();
    return business;
};

const updateBusinessProductsById = async (businessId, updateBody) => {
    let business = await getBusinessById(businessId);
    if (!business) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
    }
    business.products = updateBody.products;
    await business.save();
    return business;
};

const updateBusinessImageById = async (businessId, updateBody) => {
    let business = await getBusinessById(businessId);
    if (!business) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
    }
    business.business.businessImageUrl = updateBody.business.businessImageUrl;
    await business.save();
    return business;
};

const updateBusinessPortfolioById = async (businessId, updateBody) => {
    let business = await getBusinessById(businessId);
    if (!business) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
    }
    business.portfolioImages = updateBody.portfolioImages;
    await business.save();
    return business;
};

/**
 * Delete business by id
 * @param {ObjectId} businessId
 * @returns {Promise<Business>}
 */
const deleteBusinessById = async (businessId) => {
    const business = await getBusinessById(businessId);
    if (!business) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Business not found');
    }
    await business.remove();
    return business;
};


// Business Offers

const createOffer = async (body) => {
    return Offer.create(body);
};

const getOffers = async () => {
    return Offer.find();
};

const contactUs = async (body) => {
    return WebsiteEnquiry.create(body);
};

const addView = async (businessId, body) => {
    const data = {
        businessId: businessId,
        pageName: body.pageName
    };
    return BusinessView.create(data);
};


const getViews = async (businessId) => {
    return views = BusinessView.find({businessId: businessId});
};


module.exports = {
    createBusiness,
    queryBusinesses,
    getBusinessById,
    updateBusinessById,
    deleteBusinessById,
    updateBusinessProductsById,
    getBusinessProductsById,
    updateBusinessPortfolioById,
    getBusinessPortfolioById,
    updateBusinessImageById,
    getBusinessByKeyword,
    createOffer,
    getOffers,
    renderDemoBusiness,
    getBusinessByLanguage,
    contactUs,
    addView,
    getViews,
    queryWebsiteEnquiries,
    deletePortfolioImage
};
