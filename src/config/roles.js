const allRoles = {
  customer: ['getUsers', 'manageUsers', 'getCustomers'],
  admin: ['getUsers', 'manageUsers', 'getCustomers', 'managePayments', 'getPayments'],
  executive: ['getUsers', 'manageUsers', 'getCustomers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
