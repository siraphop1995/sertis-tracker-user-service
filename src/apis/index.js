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
// const Admin = require('../models/adminListModel');
const User = require('../db').userDocument;
const Admin = require('../db').adminDocument;

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
  res.json(admin);
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
  const admin = await Admin.deleteOne({ _id: req.params.adminId });
  let message = 'No user remove';
  if (admin.deletedCount >= 1) {
    message = 'Delete admin id: ' + req.params.adminId + ' successfully';
  }
  const response = {
    message: message,
    id: user._id
  };
  res.json(response);
};

exports.getAllUsers = async (req, res) => {
  console.log('getAllUsers');
  const user = await User.find({}, null);
  res.json(user);
};

exports.addUser = async (req, res) => {
  console.log('addUser');
  let newUser = new User(req.body);
  const user = await newUser.save();
  res.json(user);
};

exports.getUser = async (req, res) => {
  console.log('getUser');
  const user = await User.findOne({ _id: req.params.userId });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  console.log('updateUser');
  let newUser = req.body;
  const user = await User.updateOne({ _id: req.params.userId }, newUser);
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  console.log('deleteUser');
  const user = await User.deleteOne({ _id: req.params.userId });
  let message = 'No user remove';
  if (user.deletedCount >= 1) {
    message = 'Delete user id: ' + req.params.userId + ' successfully';
  }
  const response = {
    message: message,
    id: user._id
  };
  res.json(response);
};

//======= Dev Helper =========

exports.generateUser = async (req, res) => {
  console.log('generateUsr');
  const { userNo } = req.params;
  let userArray = [];

  for (let i = 1; i <= userNo; i++) {
    let str = i.toString().length === 2 ? '' : '0';
    let newUser = new User({
      lineId: 'LID_' + str + i,
      employeeId: 'EID_' + str + i,
      firstName: 'user_' + str + i,
      lastName: 'lname',
      nickName: 'nname'
    });
    userArray.push(newUser);
  }
  await User.insertMany(userArray);
  res.json(userArray);
};

exports.removeAllUser = async (req, res) => {
  const user = await User.deleteMany({});
  res.json(user);
};
