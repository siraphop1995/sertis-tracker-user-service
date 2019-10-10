'use strict';

/**
 * Middlewares to handle requests.
 * Business logics (e.g. db, provider) should be implementd separately
 * and exposed as a list of methods that will be called here.
 *
 * Different schemas may require different implementation of standard methods
 * (list, get, create, update, delete). Consult mongoose documentation
 * for more details.
 */
const _ = require('lodash');
const User = require('../models/userListModel');
const Admin = require('../models/adminListModel');

exports.helloWorld = asyncify((req, res, next) => {
  res.send('Hello World!');
});

exports.getAllAdmins = asyncify(async (req, res, next) => {
  console.log('getAllAdmins');
  const admin = await Admin.find({}, null);
  res.json(admin);
});

exports.addAdmin = asyncify(async (req, res, next) => {
  console.log('addAdmin');
  let newAdmin = new Admin(req.body);
  const admin = await newAdmin.save();
  return res.json(admin);
});

exports.getAdmin = asyncify(async (req, res, next) => {
  console.log('getAdmin');
  const admin = await Admin.findOne({ _id: req.params.adminId });
  res.json(admin);
});

exports.updateAdmin = asyncify(async (req, res, next) => {
  console.log('updateAdmin');
  let newAdmin = req.body;
  const admin = await Admin.updateOne({ _id: req.params.adminId }, newAdmin);
  res.json(admin);
});

exports.deleteAdmin = asyncify(async (req, res, next) => {
  console.log('deleteAdmin');
  const admin = await Admin.findByIdAndRemove(req.params.adminId);
  const response = {
    message: 'Delete admin id: ' + req.params.adminId + ' successfully',
    id: admin._id
  };
  res.json(response);
});

exports.getAllUsers = asyncify(async (req, res, next) => {
  console.log('getAllUsers');
  const user = await User.find({}, null);
  res.json(user);
});

exports.addUser = asyncify(async (req, res, next) => {
  console.log('addUser');
  let newUser = new User(req.body);
  const admin = await newUser.save();
  return res.json(admin);
});

exports.getUser = asyncify(async (req, res, next) => {
  console.log('getUser');
  const admin = await User.findById(req.params.adminId);
  res.json(admin);
});

exports.updateUser = asyncify(async (req, res, next) => {
  console.log('updateUser');
  let newUser = req.body;
  const admin = await User.findByIdAndUpdate(req.params.adminId, newUser);
  res.json(admin);
});

exports.deleteUser = asyncify(async (req, res, next) => {
  console.log('deleteUser');
  const admin = await User.findByIdAndRemove(req.params.adminId);
  const response = {
    message: 'Delete admin id: ' + req.params.adminId + ' successfully',
    id: admin._id
  };
  res.json(response);
});

function asyncify(fn) {
  return async (req, res, next) => {
    try {
      return await fn.apply(null, arguments);
    } catch (err) {
      next(err);
    }
  };
}
