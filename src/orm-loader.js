'use strict';

const Utils = require('./utils');


module.exports = function (GraysQL) {
  return {
    loadFromORM(translator, options) {
      if ( ! translator || typeof translator !== 'object' || Array.isArray(translator)) {
        throw new TypeError(`Expected translator to be an object, got ${typeof translator} instead`);
      }

      if ( ! Utils.isValidTranslator(translator)) {
        throw new TypeError(`Invalid translator received. A translator must implement the Translators API.`);
      }
    }
  };
};
