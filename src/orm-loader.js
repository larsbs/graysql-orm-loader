'use strict';

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

  return function LoadFromORM(GraysQL) {
    const _translator = translator;

    return {
      ['loadFrom' + name + 'ORM'](options) {
        //const models = translator.getModels();  // { ModelName: [Object], ModelName2: [Object], ... }
        //for (const modelName in models) {
          //this.registerType(_getTypeFromModel(modelName, models[modelName]));
        //}
      }
    };

  };
};
