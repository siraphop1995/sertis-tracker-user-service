'use strict';

module.exports = {
  'POST /login': {
    middlewares: ['login']
  },
  'GET /admins': {
    middlewares: ['getAllAdmins']
  },
  'POST /admins': {
    middlewares: ['createAdmin']
  },
  'GET /admins/:adminId': {
    middlewares: ['findAdminById']
  },
  'POST /findAdmin': { // why this middleware exists?
    middlewares: ['findAdmin']
  },
  'PATCH /admins/:adminId': {
    middlewares: ['updateAdmin']
  },
  'DELETE /admins/:adminId': {
    middlewares: ['deleteAdmin']
  },
  'GET /users': {
    middlewares: ['getAllUsers']
  },
  'POST /users': {
    middlewares: ['createUser']
  },
  'GET /users/:userId': {
    middlewares: ['findUserById']
  },
  'POST /findUser': { // why this middleware exists?
    middlewares: ['findUser']
  },
  'PATCH /users/:userId': {
    middlewares: ['updateUser']
  },
  'DELETE /users/:userId': {
    middlewares: ['deleteUser']
  },
  'GET /getEmployeeId/:lid': { // basically the same as findUserById
    middlewares: ['getEmployeeId']
  },
  // Test & dev routes
  'GET /helloWorld': {
    middlewares: ['helloWorld']
  },
  'GET /generateUser': {
    middlewares: ['generateUser']
  },
  'DELETE /deleteAllUser': {
    middlewares: ['deleteAllUser']
  },
  'GET /createToken': {
    middlewares: ['createToken']
  },
};
