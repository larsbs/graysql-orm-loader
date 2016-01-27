'use strict';

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
    }
  }
};
