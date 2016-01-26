module.exports = {
  isValidTranslator(translator) {
    const mustKeys = [
      'getModels',
      'getModelProperties',
      'getModelAssociations'
    ];
    for (const key of mustKeys) {
      if ( ! translator[key]) {
        return false;
      }
    }
    return true;
  },
  capitalize(str) {
    return str.replace(/(?:^|\s)\S/g, c => c.toUpperCase());
  }
};
