//'use strict';
//const _ = require('lodash');
//const GraysQL = require('graysQL');
//const pluralize = require('pluralize');

//let translator;
//let options;

//function loadFromORM(trns, opts) {
  //if (!trns) {
    //throw new Error('Invalid translator.');
  //}

  //const optionsDefaults = {
    //createMutation: true,
    //updateMutation: true,
    //deleteMutation: true
  //};
  //options = Object.assign(optionsDefaults, opts);
  //translator = trns;
  //const models = translator.getModels();
  //const GQL = new GraysQL.GQL();

  //_.each(models, function(model) { // Value, Key
    //const type = _createGraysQLTypeFromModel(model);
    //GQL.registerType(type);
  //});
//}

//function _createGraysQLTypeFromModel(model) {
  //const convertedFields = _getConvertedFieldsFromModel(model);
  //const queries = _createGraysQLQueriesFromModel(model);
  //const mutations = _createGraysQLMutationsFromModel(model);
  //const type = function(GQL) {
    //return {
      //name: '\'' + _.capitalize(model) + '\'',
      //fields: convertedFields,
      //queries: queries,
      //mutations: mutations
    //};
  //};

  //return type;
//}

//function _createGraysQLQueriesFromModel(model) {
  //const queries = {};
  //queries[model] = function(GQL) {
    //return {
      //type: '\'' + _.capitalize(model) + '\'',
      //args: {
        //id: {
          //type: 'Int'
        //}
      //},
      //resolve: (root, args) => translator.getModelById(model, args.id)
    //};
  //};

  //queries[pluralize(model)] = function(GQL) {
    //return {
      //type: '[\'' + _.capitalize(model) + ']\'',
      //resolve: (root, args) => translator.getModelByCriteria(model, args)
    //};
  //};

  //return queries;
//}

//function _createGraysQLMutationsFromModel(model) {
  //const mutations = {};
  //const convertedFields = _getConvertedFieldsFromModel(model);

  //if (options.createMutation) {
    //mutations['create' + _.capitalize(model)] = function(GQL) {
      //return {
        //name: 'create' + _.capitalize(model),
        //type: '\'' + _.capitalize(model) + '\'',
        //args: convertedFields,
        //resolve: (root, args) => translator.createModel(model, args)
      //};
    //};
  //}

  //if (options.updateMutation) {
    //mutations['update' + _.capitalize(model)] = function(GQL) {
      //return {
        //name: 'update' + _.capitalize(model),
        //type: '\'' + _.capitalize(model) + '\'',
        //args: convertedFields,
        //resolve: (root, args) => translator.updateModel(model, args)
      //};
    //};
  //}

  //if (options.deleteMutation) {
    //mutations['delete' + _.capitalize(model)] = function(GQL) {
      //return {
        //name: 'delete' + _.capitalize(model),
        //type: '\'' + _.capitalize(model) + '\'',
        //args: convertedFields,
        //resolve: (root, args) => translator.deleteModel(model, args)
      //};
    //};
  //}

  //return mutations;
//}

//function _getConvertedFieldsFromModel(model) {
  //const attributes = translator._getAttributesFrom(model); // 'accessToken': 'String'
  //const associations = translator._getAssociationsFrom(model); // 'user  ': '[User]'
  //const fields = Object.assign(attributes, associations);
  //const convertedFields = {};

  //_.mapKeys(fields, function(type, attributeName) {
    //let field = {
      //type: type
    //};
    //convertedFields[attributeName] = field;
  //});

  //return convertedFields;
//}

//module.exports = loadFromORM;
