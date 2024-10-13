const { linkedInBot } = require('../../models');
const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');

const getSavedPostId = async (id) => {
    return linkedInBot.findOne({ postId: id });  // Returns document instance if found
};

const saveLinkedInPost = async (body, postId) => {
    const linkedInBotObj = await getSavedPostId(postId);
    
    if (!linkedInBotObj) {
        // If no post with the given postId exists, create a new one
        return linkedInBot.create(body);
    } else {
        // Assign the new data to the found document and save it
        Object.assign(linkedInBotObj, body);
        await linkedInBotObj.save();  // Correct: Call save on the document instance
        return linkedInBotObj;
    }
};

const checkPostSaved = async (postId) => {
    const linkedInBotObj = await getSavedPostId(postId);  // Fetch the document instance
    if (!linkedInBotObj) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Post not found');
    } else {
        return linkedInBotObj;
    }
};

module.exports = {
    saveLinkedInPost,
    checkPostSaved
};
