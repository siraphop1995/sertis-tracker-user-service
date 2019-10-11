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

exports.helloWorld = (req, res) => {
  console.log('helloWorld');
  res.send('Hello World');
};

exports.getAllAdmins = async (req, res) => {
  console.log('getAllAdmins');
  const admin = await Admin.find({}, null);
  res.json(admin);
};

exports.addAdmin = async (req, res) => {
  console.log('addAdmin');
  let newAdmin = new Admin(req.body);
  const admin = await newAdmin.save();
  return res.json(admin);
};

exports.getAdmin = async (req, res) => {
  console.log('getAdmin');
  const admin = await Admin.findOne({ _id: req.params.adminId });
  res.json(admin);
};

exports.updateAdmin = async (req, res) => {
  console.log('updateAdmin');
  let newAdmin = req.body;
  const admin = await Admin.updateOne({ _id: req.params.adminId }, newAdmin);
  res.json(admin);
};

exports.deleteAdmin = async (req, res) => {
  console.log('deleteAdmin');
  const admin = await Admin.findByIdAndRemove(req.params.adminId);
  const response = {
    message: 'Delete admin id: ' + req.params.adminId + ' successfully',
    id: admin._id
  };
  res.json(response);
};

exports.getAllUsers = async (req, res, next) => {
  console.log('getAllUsers');
  const user = await User.find({}, null);
  res.json(user);
};

exports.addUser = async (req, res, next) => {
  console.log('addUser');
  let newUser = new User(req.body);
  const admin = await newUser.save();
  return res.json(admin);
};

exports.getUser = async (req, res, next) => {
  console.log('getUser');
  const admin = await User.findById(req.params.adminId);
  res.json(admin);
};

exports.updateUser = async (req, res, next) => {
  console.log('updateUser');
  let newUser = req.body;
  const admin = await User.findByIdAndUpdate(req.params.adminId, newUser);
  res.json(admin);
};

exports.deleteUser = async (req, res, next) => {
  console.log('deleteUser');
  const admin = await User.findByIdAndRemove(req.params.adminId);
  const response = {
    message: 'Delete admin id: ' + req.params.adminId + ' successfully',
    id: admin._id
  };
  res.json(response);
};

// function asyncWrapper(fn) {
//   return async (req, res, next) => {
//     try {
//       // return await fn(req, res, next);
//       return await fn.apply(null, [req, res, next]);
//     } catch (err) {
//       next(err);
//     }
//   };
// }

function asyncWrapper(fn) {
  return (req, res, next) => {
    fn(req, res).catch(next);
  };
}
