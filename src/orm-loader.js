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

    function _getMutationsForModel(modelName, model) {
      return {};
    }

    function _getQueriesForModel(modelName, model) {
      const findOne = {
        type: Utils.capitalize(modelName),
        args: {
          id: { type: 'Int!' }
        },
        resolve: (root, args) => translator.resolveById(model, args.id)
      };
      const findAll = {
        type: Utils.capitalize(modelName),
        resolve: (root, args) => translator.resolveAll(model)
      };
      return {
        [modelName.toLowerCase()]: findOne,
        [pluralize(modelName.toLowerCase())]: findAll
      };
    }

    function _getTypeFromModel(modelName, model) {
      const modelProperties = translator.getModelProperties(model);
      const modelAssociations = translator.getModelAssociations(model);

      return GQL => ({
        name: Utils.capitalize(modelName),
        fields: Object.assign(modelProperties, modelAssociations),
        queries: _getQueriesForModel(modelName, model),
        mutations: _getMutationsForModel(modelName, model)
      });
    }

    return {
      ['loadFrom' + Utils.capitalize(name) + 'ORM'](options) {
        const models = translator.getModels();  // { ModelName: [Object], ModelName2: [Object], ... }

        for (const modelName in models) {
          const type = _getTypeFromModel(modelName, models[modelName]);
        }
      }
    };

  };
};
