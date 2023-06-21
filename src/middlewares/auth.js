const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { userService } = require('../services');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  console.log(user);
  req.user = user;
  if (requiredRights.length) {
    const userData = await userService.getUserById(user._id);
    if(!userData) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
    const userRights = roleRights.get(userData.role.name);
    console.log(userRights);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    console.log(hasRequiredRights);
    console.log('-------------');
    console.log(req.params);
    if (!hasRequiredRights && req.params && req.params.userId !== user.id) {
      console.log('I am failed');
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
    console.log('I am passed');
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
