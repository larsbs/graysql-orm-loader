'use strict';


function parseTypeToGraysQL(type) {
  switch(type) {
      case 'Integer':
        return 'Int';
      default:
        return type;
  }
}


class MockTranslator {

  constructor(models) {
    this._models = models;
  }

  getModelsNames() {
    return Object.keys(this._models);
  }

  parseModelProperties(modelName) {
    const model = this._models[modelName];
    const properties = {};
    for (const key in model.attributes) {
      properties[key] = Object.assign(model.attributes[key], {
        type: parseTypeToGraysQL(model.attributes[key].type)
      });
    }
    return properties;
  }

  parseModelAssociations() {
  }

}

module.exports = MockTranslator;
