const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  employeeId: {
    type: String,
    unique: true,
    Required: true
  },
  username: {
    type: String,
    unique: true,
    Required: true
  },
  password: {
    type: String,
    Required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  }
});

module.exports = mongoose.model('Admin', AdminSchema);
