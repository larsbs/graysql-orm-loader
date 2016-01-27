'use strict';

const DB = require('./db');


module.exports = {
  Group: {
    attributes: {
      id: { type: 'Integer' },
      name: { type: 'String' }
    },
    relationships: {
      members: {
        hasMany: 'User'
      }
    },
    model: DB.Group,
    findById(id) {
      return DB.getGroup(id);
    },
    findAll() {
      return DB.getGroups();
    }
  },
  User: {
    attributes: {
      id: { type: 'Integer' },
      nick: { type: 'String' }
    },
    relationships: {
      group: {
        belongsTo: 'Group'
      }
    },
    model: DB.User,
    findById(id) {
      return DB.getUser(id);
    },
    findAll() {
      return DB.getUsers();
    }
  }
};
