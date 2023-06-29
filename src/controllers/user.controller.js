const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, businessService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  console.log(options);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getAllUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const result = await userService.getAllUsers(filter);
  res.send(result);
});

const getCustomers = catchAsync(async (req, res) => {
  const result = await userService.getCustomers();
  res.send(result);
});

const getRoles = catchAsync(async (req, res) => {
  const result = await userService.getRoles();
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getPhoneBookByUserId = catchAsync(async (req, res) => {
  let phoneBook = await userService.getPhoneBookByUserId(req.params.userId);
  res.send(phoneBook);
});

const deletePhoneBookByUserId = catchAsync(async (req, res) => {
  let phoneBook = await userService.deletePhoneBookByUserId(req.params.userId);
  res.send(phoneBook);
});


const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const createPhoneBook = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await userService.createPhoneBook({...req.body, userId}, userId);
  res.status(httpStatus.CREATED).send(user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getRoles,
  getCustomers,
  createPhoneBook,
  getPhoneBookByUserId,
  deletePhoneBookByUserId
};
