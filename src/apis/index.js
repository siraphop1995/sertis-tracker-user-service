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
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const stringHash = require('string-hash');
const util = require('util');

const Admin = require('../db').adminDocument;
const User = require('../db').userDocument;

const readFile = util.promisify(fs.readFile);

/**
 * POST
 *   /login
 *     @description Authenticate admin account.
 *      @param req.body.username {string} Admin username.
 *      @param req.body.password {string} Admin password.
 *     @response
 *       200:
 *         description: Correct username and password
 *         return {string} jwt token
 *         return {Object} admin info object
 *       401:
 *         description: Wrong username or password
 */
exports.login = async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username });
  if (!admin || !bcrypt.compareSync(req.body.password, admin.password)) {
    return res
      .status(401)
      .json({ message: 'Username and password does not match' });
  }

  let token = jwt.sign({ admin }, 'secret', {
    expiresIn: '7d'
  });

  delete admin.password;

  return res.status(200).json({
    admin,
    message: 'Authenticated! Use this token in the Authorization header',
    token: token
  });
};

/**
 * GET
 *   /getAllAdmins
 *     @description To get a list of all admin
 *     @return {Array} Array of admin data object
 */
exports.getAllAdmins = async (req, res) => {
  console.log('getAllAdmins');
  const admin = await Admin.find({}, null);
  res.json(admin);
};

/**
 * POST
 *   /createAdmin
 *     @description Create new admin
 *      @param req.body.admin {Object} Admin data object.
 *      @return {Object} Admin data object
 */
exports.createAdmin = async (req, res) => {
  console.log('createAdmin');
  let newAdmin = new Admin(req.body);
  newAdmin.password = bcrypt.hashSync(req.body.password, 10);
  const admin = await newAdmin.save();
  delete admin.password;
  res.json(admin);
};

/**
 * POST
 *   /findAdminById/:adminId
 *     @description Query for admin by id
 *      @param req.params.adminId {string} Admin mongo id.
 *      @return {object} Admin data object
 */
exports.findAdminById = async (req, res) => {
  console.log('findAdminById');
  const admin = await Admin.findOne({ _id: req.params.adminId });
  res.json(admin);
};

/**
 * POST
 *   /findAdmin
 *     @description Query for admin
 *      @param req.body.query {Object} Admin data object.
 *      @return {object} Admin data object
 */
exports.findAdmin = async (req, res) => {
  console.log('findAdmin');
  const admin = await Admin.findOne(req.body);
  res.json({ admin });
};

/**
 * PATCH
 *   /updateAdmin/:adminId
 *     @description Update admin data
 *      @param req.params.adminId {string} Admin mongo id.
 *      @param req.body.query {Object} Admin data object.
 *      @return {object} Admin data object
 */
exports.updateAdmin = async (req, res) => {
  console.log('updateAdmin');
  const admin = await Admin.updateOne({ _id: req.params.adminId }, req.body);
  res.json(admin);
};

/**
 * DELETE
 *   /deleteAdmin/:adminId
 *     @description Delete admin data
 *      @param req.params.adminId {string} Admin mongo id.
 *      @return {object} Delete response
 */
exports.deleteAdmin = async (req, res) => {
  console.log('deleteAdmin');
  const admin = await Admin.deleteOne({ _id: req.params.adminId });
  const response = {
    message: 'No user remove',
    id: user._id
  };
  if (admin.deletedCount >= 1) {
    response.message = 'Delete admin id: ' + req.params.adminId + ' successfully';
  }
  res.json(response);
};

/**
 * GET
 *   /getAllUsers
 *     @description To get a list of all admin
 *      @return {Array} Array of user data object
 */
exports.getAllUsers = async (req, res) => {
  console.log('getAllUsers');
  const user = await User.find({}, null, { sort: { uid: 1 } });
  res.json({ user });
};

/**
 * POST
 *   /createUser
 *     @description Create new user
 *      @param req.body.user {Object} User data object.
 *      @return {Object} User data object
 */
exports.createUser = async (req, res) => {
  console.log('createUser');
  let newUser = new User(req.body);
  let hash = createInitCode(newUser);
  newUser.initCode = hash;
  const user = await newUser.save();
  res.json({ user });
};

/**
 * POST
 *   /findUserById/:userId
 *     @description Query for user by id
 *      @param req.params.userId {string} User mongo id.
 *      @return {object} User data object
 */
exports.findUserById = async (req, res) => {
  console.log('findUserById');
  const user = await User.findOne({ _id: req.params.userId });
  res.json({ user });
};

/**
 * POST
 *   /findUser
 *     @description Query for user data
 *      @param req.body.query {Object} User data object.
 *      @return {object} User data object
 */
exports.findUser = async (req, res) => {
  console.log('findUser');
  const user = await User.findOne(req.body);
  res.json({ user });
};

/**
 * PATCH
 *   /updateUser/:userId
 *     @description Update user data
 *      @param req.params.userId {string} User mongo id.
 *      @param req.body.query {Object} User data object.
 *      @return {Object} User data object
 */
exports.updateUser = async (req, res) => {
  console.log('updateUser');
  const user = await User.updateOne({ _id: req.params.userId }, req.body);
  res.json({ user });
};

/**
 * DELETE
 *   /deleteUser/:userId
 *     @description Delete user data
 *      @param req.params.userId {string} User mongo id.
 *      @return {object} Delete response
 */
exports.deleteUser = async (req, res) => {
  console.log('deleteUser');
  const user = await User.deleteOne({ _id: req.params.userId });
  const response = {
    message: 'No user remove',
    id: user._id
  };
  if (user.deletedCount >= 1) {
    response.message = 'Delete user id: ' + req.params.userId + ' successfully';
  }
  res.json(response);
};

/**
 * DELETE
 *   /getEmployeeId/:lid
 *     @description Find uid from lid
 *      @param req.params.lid {string} User line id.
 *      @return {string} uid
 *      @return {string} status
 */
exports.getEmployeeId = async (req, res) => {
  console.log('getEmployeeId');
  const user = await User.findOne({ lid: req.params.lid });
  const response = {
    uid: user ? null : user.uid,
    status: user ? 'not found' : 'ok'
  };
  res.json(response);
};

//The following route are use for testing and development

/**
 * GET
 *   /
 *     @description To test api to user service
 *     @return {string} Hello message
 */
exports.helloWorld = (req, res, next) => {
  console.log('Hello World! user-service');
  res.json({ message: 'Hello World! user-service' });
};

/**
 * GET
 *   /generateUser
 *     @description Load user from userListjson
 *                  and save to database
 *      @return {Array} Array of user data object
 */
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

/**
 * GET
 *   /deleteAllUser
 *     @description Delete all user
 *      @return {Object} Delete respond
 */
exports.deleteAllUser = async (req, res) => {
  const user = await User.deleteMany({});
  res.json({ user });
};

/**
 * GET
 *   /createToken
 *     @description To generate empty jwt token(for dev purpose)
 *     @return {string} JWT token
 */
exports.createToken = async (req, res) => {
  let token = jwt.sign({}, 'secret');

  return res.status(200).json({
    token: token
  });
};

/**
 * Take in user object to generate
 * hash from firstName and lastName
 * @param     {object} user - user object
 * @returns   {number} number
 * @example   createInitCode(user)
 */
function createInitCode(user) {
  let hash = stringHash(user.firstName + user.lastName);
  hash = hash.toString().slice(0, 6);
  return parseInt(hash, 10);
}
