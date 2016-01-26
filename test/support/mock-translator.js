'use strict';


class MockTranslator {

  constructor(models) {
    this._models = models;
  }

  getModelsNames() {
    return Object.keys(this._models);
  }

  getModelProperties() {
  }

  getModelAssociations() {
  }

}

module.exports = MockTranslator;
