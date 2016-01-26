# GraysQL ORM Loader #

GraysQL ORM Loader is an extension for [GraysQL]() which transforms your favorite ORM models into a compatible GraphQL Schema. In order to do the transformation, it needs an ORM translator.
If your favorite ORM still not have a translator, you can build it yourself in a easy way.


## Installation ##

Install it from npm. Note that this is an extension for GraysQL, so you must have it installed in order to work.

```bash
$ npm install graysql-orm-loader
```


## Examples ##

Here is a simple example using [Sails.js]() with [Waterline]() as model provider.

```javascript
const GraysQL = require('graysql');
const OrmLoader = require('graysql-orm-loader');
const WaterlineTranslator = require('graysql-orm-waterline');

const GQL = new GraysQL();

// Add the extension to GQL
GQL.use(OrmLoader);
// Create an instance of the translator and pass to it all the models
// (in this case the object `sails.models` contains all waterline models)
GQL.loadFromORM(new WaterlineTranslator(sails.models));

const Schema = GQL.generateSchema();
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

```javascript
const GraysQL = require('graysql');
const OrmLoader = require('graysql-orm-loader');
const WaterlineTranslator = require('graysql-orm-waterline');

const GQL = new GraysQL();


GQL.use(OrmLoader);
GQL.loadFromORM(new WaterlineTranslator(sails.models), {deleteMutation: False});
```

## Translator API ##

*TODO*

## Examples ##

Usage examples can be found in [examples]() directory.

## Tests ##

The tests are write with [mocha]() and can be runned with the following command:

```bash
$ npm test
```

## License ##

[MIT]()