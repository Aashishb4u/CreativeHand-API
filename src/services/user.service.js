const httpStatus = require('http-status');
const { User, PhoneBook } = require('../models');
const { Role } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (await User.isContactTaken(userBody.contactNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contact Number is taken');
  }

  return User.create(userBody);
};

const createPhoneBook = async (body, userId) => {
  const phoneBook = await getPhoneBookByUserId(userId);
  if (!phoneBook) {
    return PhoneBook.create(body);
  } else {
    Object.assign(phoneBook, body);
    await phoneBook.save();
    return phoneBook;
  }
};


/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const updatedOptions = {...options, populate: 'role'}
  const users = await User.paginate(filter, updatedOptions);
  return users;
};

const getAllUsers = async (filter) => {
  return await User.find(filter);
};

const getRoles = async () => {
  const roles = await Role.find();
  return roles;
};

const getRoleByName = async (name) => {
  const roleDetails = await Role.findOne({ name });
  console.log(roleDetails);
  return roleDetails;
};

const getCustomers = async () => {
  const {id} = await getRoleByName('customer');
  const customers = await User.find({ role: id }).populate('role');
  return customers;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).populate('role');
};

const getPhoneBookByUserId = async (id) => {
  return PhoneBook.findOne({ userId: id });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email }).populate('role');
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (updateBody.contactNumber && (await User.isContactTaken(updateBody.contactNumber, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contact Number is taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const deletePhoneBookByUserId = async (userId) => {
  const phoneBook = await getPhoneBookByUserId(userId);
  if (!phoneBook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'phoneBook Details not found');
  }
  await phoneBook.remove();
  return phoneBook;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getRoles,
  getCustomers,
  createPhoneBook,
  getRoleByName,
  getAllUsers,
  getPhoneBookByUserId,
  deletePhoneBookByUserId
};
