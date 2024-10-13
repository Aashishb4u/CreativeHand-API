const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { linkedInService } = require('../../services/portfolio');
const {handleSuccess} = require('../../utils/SuccessHandler');

const saveLinkedInPost = catchAsync(async (req, res) => {
    const { postId } = req.body;
    console.log('postId');
    const linkedInpost = await linkedInService.saveLinkedInPost(req.body, postId);
    res.status(httpStatus.CREATED).send({ linkedInpost});
});

const getLinkedInPost = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const linkedInpost = await linkedInService.checkPostSaved(postId);
    // res.status(httpStatus.OK).send({ linkedInpost});
    handleSuccess(httpStatus.CREATED, {linkedInpost}, 'Post fetched Successfully.', req, res);
});


module.exports = {
    saveLinkedInPost,
    getLinkedInPost
};
