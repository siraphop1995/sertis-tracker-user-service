'use strict';

/**
 * Mongoose main document schema and model.
 * Model should be defined only for the main document.
 */

const mongoose = require('mongoose');
const { hooks, methods, toJSON } = require('./functions');

const AdminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      Required: true
    },
    password: {
      type: String,
      Required: true
    },
    accountName: {
      type: String
    },
    metadata: {
      created: {
        type: Date,
        default: Date.now
      },
      updated: {
        type: Date,
        default: Date.now
      }
    }
  },
  { toJSON }
);

/**
 * Middlewares a.k.a. Hooks
 * Refer to mongoose document for more details.
 * Fat arrow notation cannot be used due to its lexical scope property.
 */
const preHooks = Object.keys(hooks.pre);
const postHooks = Object.keys(hooks.post);

preHooks.forEach(hook => {
  AdminSchema.pre(hook, hooks.pre[hook]);
});
postHooks.forEach(hook => {
  AdminSchema.post(hook, hooks.post[hook]);
});

/**
 * Custom methods for this schema.
 * Fat arrow notation cannot be used due to its lexical scope property.
 */
const customMethods = Object.keys(methods);
customMethods.forEach(method => {
  AdminSchema.methods[method] = methods[method];
});

module.exports = mongoose.model('Admin', AdminSchema);
