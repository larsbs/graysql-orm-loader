'use strict';

module.exports = {
  User: {
    attributes: {
      id: { type: 'Integer' },
      nick: { type: 'String' }
    },
    relationships: {
      group: {
        belongsTo: 'Group'
      }
    }
  },
  Group: {
    attributes: {
      id: { type: 'Integer' },
      name: { type: 'String' }
    },
    relationships: {
      members: {
        hasMany: 'User'
      }
    }
  }
};
