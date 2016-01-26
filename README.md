# GraysQL ORM Loader #

GraysQL ORM Loader is an extension for [GraysQL](https://github.com/larsbs/graysql) that transforms your existent ORM models/schema into a GraphQL Schema. In order to do the transformation, this extension needs an ORM translator. The
translator will take care of the implementation details of the ORM and will get the data that ORM Loader needs.

If the ORM that you use doesn't have a translator, you can build it yourself using the [Translators API]().

## Installation ##

Install this package from npm using the following command:

```bash
$ npm install graysql-ext-orm-loader
```

Note that this is an extension for GraysQL, so you must have it installed in order for this to work.

## Example ##

Here is a simple example using [Sails.js](http://sailsjs.org/) with [Waterline](https://github.com/balderdashy/waterline) as the ORM.

```javascript
const GraysQL = require('graysql');
const ORMLoader = require('graysql-orm-loader');
const WaterlineTranslator = require('graysql-orm-loader-waterline');  // We'll use the waterline translator

const GQL = new GraysQL();

// Add the extension to GQL
GQL.use(ORMLoader);

// Instantiate the translator and pass the sails models.
GQL.loadFromORM(new WaterlineTranslator(sails.models));

// Generate the schema
const Schema = GQL.generateSchema();
console.log(Schema);
```

## Overview ##

The main object in the GraysQL ORM Loader extension is a translator. A translator is a class that transforms a series of models of an ORM into compatible types, queries and mutations with [GraysQL]() in order to create a [GraphQL schema]().
The automatically types, queries and mutations created are the following ones:

  * **Types**: A valid type for every model, including the relations betweens them.
  * **Queries**:
    * *getModelById(id)*: Get a model by its id.
    * *getModelByCriteria(args)*: Get a model by a criteria specified in args (for example {'foo': 'bar'})
  * **Mutations**:
   * *createModel(args)*: A mutation for creating a model with args as attribute.
   * *updateModel(args)*: A mutation for updating a model with args as attributes updates.
   * *deleteModel*: A mutation for deleting a model.

You can configure which mutations will this extension create automatically. Just see the [loadFromORM]() API.

Creating a custom translator is easy. Just create a javascript class that follows the [Translator API]().

## loadFromORM ##

This extension adds the following method to GraysQL.

#### `GQL.loadFromORM(translator[, options])` ####
> Receives an instance of an ORM Translator with its corresponding models and automatically creates valid types, queries and mutations in GraysQL.

* **Parameters**:
  * `translator` *Object*: An instance of a valid translator for GraysQL ORM Loader.
  * `options` *Object*:  An object to configure the mutations which this extension will automatically create. The available options are:
    * `createMutation: true|false`. This option indicates if a createMutation must be created. By default *True*
    * `updateMutation: true|false`. This option indicates if a updateMutation must be created. By default *True*
    * `deleteMutation: true|false`. This option indicates if a deleteMutation must be created. By default *True*

## Translators API ##

*TODO*

## Examples ##

An usage example can be found in [example](example) directory.

## Tests ##

The tests are written with [mocha](https://mochajs.org) and can be run with the following command:

```bash
$ npm test
```

## License ##

[MIT](LICENSE)