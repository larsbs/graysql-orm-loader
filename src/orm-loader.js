'use strict';

const pluralize = require('pluralize');
const Utils = require('./utils');


module.exports = function (name, translator) {
  if ( ! translator || typeof translator !== 'object' || Array.isArray(translator)) {
    throw new TypeError(`Expected translator to be an object, got ${typeof translator} instead`);
  }

  if ( ! name || typeof name !== 'string') {
    throw new TypeError(`Expected name to be a string, go ${typeof name} instead`);
  }

  if ( ! Utils.isValidTranslator(translator)) {
    throw new TypeError(`Invalid translator received. A translator must implement the Translators API.`);
  }

  return (/* GraysQL */) => {

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

    function _getMutationsForModel(modelName, mutationsOptions) {
      const mutations = {};

      if (mutationsOptions.create) {
        mutations[`create${Utils.capitalize(modelName)}`] = {
          type: Utils.capitalize(modelName),
          args: translator.getArgsForCreate(modelName),
          resolve: translator.resolveCreate(modelName)
        };
      }
      if (mutationsOptions.update) {
        mutations[`update${Utils.capitalize(modelName)}`] = {
          type: Utils.capitalize(modelName),
          args: translator.getArgsForUpdate(modelName),
          resolve: translator.resolveUpdate(modelName)
        };
      }
      if (mutationsOptions.delete) {
        mutations[`delete${Utils.capitalize(modelName)}`] = {
          type: Utils.capitalize(modelName),
          args: translator.getArgsForDelete(modelName),
          resolve: translator.resolveDelete(modelName)
        };
      }

      return mutations;
    }

    function _getQueriesForModel(modelName) {
      const findOne = {
        type: Utils.capitalize(modelName),
        args: {
          id: { type: 'Int!' }
        },
        resolve: translator.resolveById(modelName)
      };
      const findAll = {
        type: Utils.capitalize(modelName),
        resolve: translator.resolveAll(modelName)
      };
      return {
        [modelName.toLowerCase()]: findOne,
        [pluralize(modelName.toLowerCase())]: findAll
      };
    }

    function _getTypeFromModel(modelName, options) {
      const modelProperties = translator.parseModelProperties(modelName);
      const modelAssociations = translator.parseModelAssociations(modelName);

      return (/* GQL */) => ({
        name: Utils.capitalize(modelName),
        fields: Object.assign({}, modelProperties, modelAssociations),
        queries: _getQueriesForModel(modelName),
        mutations: _getMutationsForModel(modelName, options.mutations)
      });
    }

    return {
      ['loadFrom' + Utils.capitalize(name) + 'ORM'](opts) {
        const modelsNames = translator.getModelsNames();  // [ ModelName, ModelName2, ... ]
        const options = _setDefaults(opts);

        for (const modelName of modelsNames) {
          const type = _getTypeFromModel(modelName, options);
          this.registerType(type);
        }
      }
    };

  };
};
