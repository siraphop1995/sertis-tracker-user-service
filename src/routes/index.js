'use strict';

module.exports = {
  'GET /': {
    middlewares: ['helloWorld']
  },
  'GET /getAllAdmins': {
    middlewares: ['getAllAdmins']
  },
  'POST /createAdmin': {
    middlewares: ['createAdmin']
  },
  'GET /findAdminById/:adminId': {
    middlewares: ['findAdminById']
  },
  'PATCH /updateAdmin/:adminId': {
    middlewares: ['updateAdmin']
  },
  'DELETE /deleteAdmin/:adminId': {
    middlewares: ['deleteAdmin']
  },
  'GET /getAllUsers': {
    middlewares: ['getAllUsers']
  },
  'POST /createUser': {
    middlewares: ['createUser']
  },
  'GET /findUserById/:userId': {
    middlewares: ['findUserById']
  },
  'POST /findUser': {
    middlewares: ['findUser']
  },
  'PATCH /updateUser/:userId': {
    middlewares: ['updateUser']
  },
  'DELETE /deleteUser/:userId': {
    middlewares: ['deleteUser']
  },
  'GET /getEmployeeId/:lineId': {
    middlewares: ['getEmployeeId']
  },
  'GET /generateUser': {
    middlewares: ['generateUser']
  },
  'GET /removeAllUser': {
    middlewares: ['removeAllUser']
  }
};
