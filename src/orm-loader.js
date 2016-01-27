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
      const createObj = {
        type: Utils.capitalize(modelName),
        args: translator.getArgsForCreate(modelName),
        resolve: translator.resolveCreate(modelName)
      };
      const updateObj = {
        type: Utils.capitalize(modelName),
        args: translator.getArgsForUpdate(modelName),
        resolve: translator.resolveUpdate(modelName)
      };
      const deleteObj = {
        type: Utils.capitalize(modelName),
        args: translator.getArgsForDelete(modelName),
        resolve: translator.resolveDelete(modelName)
      };
      return {
        [`create${Utils.capitalize(modelName)}`]: createObj,
        [`update${Utils.capitalize(modelName)}`]: updateObj,
        [`delete${Utils.capitalize(modelName)}`]: deleteObj
      };
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
          this.registerType(type);
        }
      }
    };

  };
};
