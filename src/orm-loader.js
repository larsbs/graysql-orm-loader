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

  return GraysQL => {

    function _getMutationsForModel(modelName) {
      return {};
    }

    function _getQueriesForModel(modelName) {
      const findOne = {
        type: Utils.capitalize(modelName),
        args: {
          id: { type: 'Int!' }
        },
        resolve: (root, args) => translator.resolveById(modelName, args.id)
      };
      const findAll = {
        type: Utils.capitalize(modelName),
        resolve: (root, args) => translator.resolveAll(modelName)
      };
      return {
        [modelName.toLowerCase()]: findOne,
        [pluralize(modelName.toLowerCase())]: findAll
      };
    }

    function _getTypeFromModel(modelName) {
      const modelProperties = translator.parseModelProperties(modelName);
      const modelAssociations = translator.parseModelAssociations(modelName);

      return GQL => ({
        name: Utils.capitalize(modelName),
        fields: Object.assign({}, modelProperties, modelAssociations),
        queries: _getQueriesForModel(modelName),
        mutations: _getMutationsForModel(modelName)
      });
    }

    return {
      ['loadFrom' + Utils.capitalize(name) + 'ORM'](options) {
        const modelsNames = translator.getModelsNames();  // [ ModelName, ModelName2, ... ]

        for (const modelName of modelsNames) {
          const type = _getTypeFromModel(modelName);
          console.dir(type(this), 4);
          this.registerType(type);
        }
      }
    };

  };
};
