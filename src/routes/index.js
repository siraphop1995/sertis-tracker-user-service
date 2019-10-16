'use strict';

module.exports = {
  'GET /': {
    middlewares: ['helloWorld']
  },
  'GET /admin': {
    middlewares: ['getAllAdmins']
  },
  'POST /admin': {
    middlewares: ['addAdmin']
  },
  'GET /admin/:adminId': {
    middlewares: ['getAdmin']
  },
  'PATCH /admin/:adminId': {
    middlewares: ['updateAdmin']
  },
  'DELETE /admin/:adminId': {
    middlewares: ['deleteAdmin']
  },
  'GET /user': {
    middlewares: ['getAllUsers']
  },
  'POST /user': {
    middlewares: ['addUser']
  },
  'GET /user/:userId': {
    middlewares: ['getUser']
  },
  'PATCH /user/:userId': {
    middlewares: ['updateUser']
  },
  'DELETE /user/:userId': {
    middlewares: ['deleteUser']
  },
  'GET /generateUser/:userNo': {
    middlewares: ['generateUser']
  },
  'GET /removeAllUser/': {
    middlewares: ['removeAllUser']
  },
};
