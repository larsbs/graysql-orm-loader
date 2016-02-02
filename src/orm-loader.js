'use strict';

const pluralize = require('pluralize');
const Utils = require('./utils');


function _setDefaults(options) {
  options = Object.assign({
    relay: false,
    mutations: {}
  }, options);
  options.mutations = Object.assign({
    create: true,
    update: true,
    delete: true
  }, options.mutations);
  return options;
}


module.exports = (/* GraysQL */) => {

  let _translator;

  function _getMutationsForModel(modelName, mutationsOptions) {
    const mutations = {};

    if (mutationsOptions.create) {
      mutations[`create${Utils.capitalize(modelName)}`] = {
        type: modelName,
        args: _translator.getArgsForCreate(modelName),
        resolve: _translator.resolveCreate(modelName)
      };
    }
    if (mutationsOptions.update) {
      mutations[`update${Utils.capitalize(modelName)}`] = {
        type: modelName,
        args: _translator.getArgsForUpdate(modelName),
        resolve: _translator.resolveUpdate(modelName)
      };
    }
    if (mutationsOptions.delete) {
      mutations[`delete${Utils.capitalize(modelName)}`] = {
        type: modelName,
        args: _translator.getArgsForDelete(modelName),
        resolve: _translator.resolveDelete(modelName)
      };
    }

    return mutations;
  }

  function _getQueriesForModel(modelName) {
    const findOne = {
      type: modelName,
      args: {
        id: { type: 'Int!' }
      },
      resolve: _translator.resolveById(modelName)
    };
    const findAll = {
      type: `[${modelName}]`,
      resolve: _translator.resolveAll(modelName)
    };
    return {
      [modelName.toLowerCase()]: findOne,
      [pluralize(modelName.toLowerCase())]: findAll
    };
  }

  function _getTypeFromModel(modelName, options) {
    const modelProperties = _translator.parseModelProperties(modelName);
    const modelAssociations = _translator.parseModelAssociations(modelName, options.relay);

    let type = {
      name: modelName,
      fields: Object.assign({}, modelProperties, modelAssociations),
      queries: _getQueriesForModel(modelName),
      mutations: _getMutationsForModel(modelName, options.mutations)
    };

    if (options.relay) {
      type = Object.assign({}, type, {
        interfaces: ['Node'],
        nodeId: _translator.resolveNodeId(modelName),
        isTypeOf: _translator.resolveIsTypeOf(modelName)
      });
    }

    return (/* GQL */) => type;
  }

  return {
    loadFromORM(translator, opts) {
      if ( ! translator || typeof translator !== 'object' || Array.isArray(translator)) {
        throw new TypeError(`Expected translator to be an object, got ${typeof translator} instead`);
      }

      if ( ! Utils.isValidTranslator(translator)) {
        throw new TypeError(`Invalid translator received. A translator must implement the Translators API.`);
      }

      _translator = translator;

      const modelsNames = translator.getModelsNames();  // [ ModelName, ModelName2, ... ]
      const options = _setDefaults(opts);

      if (options.relay) {
        // TODO: Add a method to check if Graylay is enabled, and if not, throw an Error
      }

      for (const modelName of modelsNames) {
        const type = _getTypeFromModel(modelName, options);
        this.registerType(type);
      }
    }

  };

};
