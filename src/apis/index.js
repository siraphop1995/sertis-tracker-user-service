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
const User = require('../db').userDocument;
const Admin = require('../db').adminDocument;
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const stringHash = require('string-hash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /:
 *   post:
 *     description: Authenticate admin account.
 *     responses:
 *       200:
 *         description: Correct username and password
 *       401:
 *         description: Wrong username or password
 */
exports.login = async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin) {
    return res
      .status(401)
      .json({ message: 'Username and password does not match' });
  }
  if (!bcrypt.compareSync(req.body.password, admin.password)) {
    return res
      .status(401)
      .json({ message: 'Username and password does not match' });
  }

  let token = jwt.sign({ admin }, 'secret', {
    expiresIn: '7d'
  });

  admin.password = undefined;

  return res.status(200).json({
    admin,
    message: 'Authenticated! Use this token in the Authorization header',
    token: token
  });
};

exports.createToken = async (req, res) => {
  let token = jwt.sign({}, 'secret');

  return res.status(200).json({
    token: token
  });
};

exports.getAllAdmins = async (req, res) => {
  console.log('getAllAdmins');
  const admin = await Admin.find({}, null);
  res.json(admin);
};

exports.createAdmin = async (req, res) => {
  console.log('createAdmin');
  let newAdmin = new Admin(req.body);
  newAdmin.password = bcrypt.hashSync(req.body.password, 10);
  const admin = await newAdmin.save();
  admin.password = undefined;
  res.json(admin);
};

exports.findAdminById = async (req, res) => {
  console.log('findAdminById');

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
  const user = await User.find({}, null, { sort: { uid: 1 } });
  res.json({ user });
};

exports.createUser = async (req, res) => {
  console.log('createUser');
  let newUser = new User(req.body);
  let hash = createInitCode(newUser);
  newUser.initCode = hash;
  const user = await newUser.save();
  res.json({ user });
};

exports.findUserById = async (req, res) => {
  console.log('findUserById');
  const user = await User.findOne({ _id: req.params.userId });
  res.json({ user });
};

exports.findUser = async (req, res) => {
  console.log('findUser');
  const query = req.body;
  const user = await User.findOne(query);
  res.json({ user });
};

exports.updateUser = async (req, res) => {
  console.log('updateUser');
  let newUser = req.body;
  const user = await User.updateOne({ _id: req.params.userId }, newUser);
  res.json({ user });
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

exports.getEmployeeId = async (req, res) => {
  console.log('getEmployeeId');

  const user = await User.findOne({ lid: req.params.lid });

  if (!user) {
    res.json({
      uid: null,
      status: 'not found'
    });
  } else {
    res.json({
      uid: user.uid,
      status: 'ok'
    });
  }
};

//======= Dev Helper =========

exports.generateUser = async (req, res) => {
  console.log('generateUsr');
  let userArray = [];

  const contents = await readFile(
    path.join(__dirname, '../utils/userList.json'),
    'utf8'
  );
  let userList = JSON.parse(contents);

  for (let i = 0; i < userList.length; i++) {
    let hash = createInitCode(userList[i]);
    userList[i].lid = 'L' + hash;
    userList[i].initCode = hash;
    userArray.push(userList[i]);
  }

  await User.insertMany(userArray);
  res.json({ user: userArray });
};

exports.deleteAllUser = async (req, res) => {
  const user = await User.deleteMany({});
  res.json({ user });
};

/**
 * @param           {Object} user - user object
 * @returns         {number} number
 * @description     Take in user object to generate hash
 *                  from firstName and lastName
 */
function createInitCode(user) {
  let hash = stringHash(user.firstName + user.lastName);
  hash = hash.toString().slice(0, 6);
  return parseInt(hash, 10);
}
