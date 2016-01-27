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

function parseRelationshipToGraysQL(relationship) {
  if (relationship.hasOwnProperty('belongsTo')) {
    return { type: relationship.belongsTo };
  }
  else if (relationship.hasOwnProperty('hasMany')){
    return { type: `[${relationship.hasMany}]`};
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

  parseModelAssociations(modelName) {
    const model = this._models[modelName];
    const properties = {};
    for (const key in model.relationships) {
      properties[key] = parseRelationshipToGraysQL(model.relationships[key]);
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

}

module.exports = MockTranslator;
