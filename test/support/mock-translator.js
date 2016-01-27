'use strict';

const deepFreeze = require('deep-freeze');
const DB = require('./db');


function parseTypeToGraysQL(type) {
  switch(type) {
      case 'Integer':
        return 'Int';
      default:
        return type;
  }
}

function parseRelationshipUsingRelay(key, relationship) {
  return {
    type: `@${relationship.hasMany}`,
    resolve: (root, args) => root[key]
  }
}

function parseRelationshipToGraysQL(key, relationship, useRelay) {
  if (relationship.hasOwnProperty('belongsTo')) {
    return { type: relationship.belongsTo };
  }
  else if (relationship.hasOwnProperty('hasMany')){
    if (useRelay) {
      return parseRelationshipUsingRelay(key, relationship);
    }
    else {
      return { type: `[${relationship.hasMany}]`};
    }
  }
}


class MockTranslator {

  constructor(models) {
    this._models = deepFreeze(models);
  }

  getModelsNames() {
    return Object.keys(this._models);
  }

  parseModelProperties(modelName) {
    const model = this._models[modelName];
    const properties = {};
    for (const key in model.attributes) {
      properties[key] = Object.assign({}, model.attributes[key], {
        type: parseTypeToGraysQL(model.attributes[key].type)
      });
    }
    return properties;
  }

  parseModelAssociations(modelName, useRelay) {
    const model = this._models[modelName];
    const properties = {};
    for (const key in model.relationships) {
      properties[key] = parseRelationshipToGraysQL(key, model.relationships[key], useRelay);
    }
    return properties;
  }

  getArgsForCreate(modelName) {
    const args = this.parseModelProperties(modelName);
    delete args.id;
    for (const key in args) {
      args[key].type = args[key].type + '!';
    }
    return args;
  }

  getArgsForUpdate(modelName) {
    const args = this.parseModelProperties(modelName);
    for (const key in args) {
      args[key].type = args[key].type + '!';
    }
    return args;
  }

  getArgsForDelete(modelName) {
    const args = this.parseModelProperties(modelName);
    return { id: { type: args.id.type + '!' }};
  }

  resolveById(modelName) {
    return (root, args) => this._models[modelName].findById(args.id);
  }

  resolveAll(modelName) {
    return (root, args) => this._models[modelName].findAll();
  }

  resolveCreate(modelName) {
  }

  resolveUpdate(modelName) {
  }

  resolveDelete(modelName) {
  }

  resolveNodeId(modelName) {
    return id => this._models[modelName].findById(id);
  }

  resolveIsTypeOf(modelName) {
    return obj => obj instanceof this._models[modelName].model;
  }

}

module.exports = MockTranslator;
