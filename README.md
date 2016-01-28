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

In order to load a Schema from the ORM you will need a translator. Then, this
library will use that translator to retrieve the necessary information from
the ORM and load it into [GraysQL](https://github.com/larsbs/graysql). This
loader will create the following objects for each model.

  * **Types**: A valid [GraysQL Type](https://github.com/larsbs/graysql#Type) for every model in the ORM.
  * **Queries**: For each type created, these queries will be created too:
    * `type(id: Int): Type`: Gets a single type by its id.
    * `types(): [Type]`: Gets all the types.
  * **Mutations**: For each type created, these mutations will be created too:
   * `createType(args)`: Creates a type.
   * `updateType(args)`: Updates a type.
   * `deleteType(args)`: Deletes a type.

If you don't want to create all the mutations by default, you can customize what mutations the loader will create automatically.

### Methods ###

This extension adds the following method to GraysQL.

#### `GQL.loadFromORM(translator, [options])` ####
> Receives an instance of an ORM Translator and will use this translator to
> load all the models into GraysQL.

* **Parameters**:
  * `translator` *Object*: An instance of a valid translator.
  * `options` *Object*:  A configuration object with the following keys and default values:

  ```javascript
  {
    relay: false,  // Create valid relay types instead of default ones.
    mutations: {
      create: true,  // Indicates if a create mutation shoud be created.
      update: true,  // Indicates if a update mutation should be creted.
      delete: true   // Indicates if a delete mutation should be created.
    }
  }
  ```

## Translators API ##

A translator is simply an object that implements certain methods. As long as
the result is this object, it can be a class, a raw object, a function, etc.
There is a [mock translator](test/support/mock-translator.js) in the tests folder that you can take as example. Usually, but not necessarily, a translator
implements a method to receive the models that it should translate from.

The methods that translators must implement are:

#### `getModelsNames()` ####
> Returns an array with the name of all the models in the translators.

 * **Returns**
   * *Array: String*: An array containing the names of the models inside the translator.

```javascript
const expected = ['Group', 'User'];
const result = translator.getModelsNames();
expect(result).to.deep.equal(expected);
```

#### `parseModelProperties(modelName)` ####
> Returns the parsed properties of the model indicated with the modelName
> argument. Only the properties are parsed here, ignore the relationships.
> The returned properties object should be an object with keys as the names of [GraysQL Types](http://github.com/larsbs/graysql#Type) fields, and the value as the fields.

 * **Parameters**
   * `modelName` *String*: The name of the model to parse.
 * **Returns**
   * *Object*: An object containing the parsed properties.

```javascript
const expected = {
  id: {
    type: 'Int'
  },
  nick: {
    type: 'String'
  }
};
const result = translator.parseModelProperties('User');
expect(result).to.deep.equal(expected);
```

#### `parseModelAssociations(modelName)` ####
> Returns the parsed associations of the model indicated with the modelName
> argument. ONly the associations are parsed here, ignore the properties.
> The returned associations object should be an object with keys as the names of [GraysQL Types](http://github.com/larsbs/graysql#Type) fields, and the value as the fields.

* **Parameters**
  * `modelName` *String*: The name of the model to parse.
* **Returns**
  * *Object*: An object containing the parsed associations.

```javascript
const expected = {
  members: {
    tye: '[User]'
  }
};
const result = translator.parseModelAssociations('Group');
expect(result).to.deep.equal(expected);
```

#### `getArgsForCreate(modelName)` ####

#### `getArgsForUpdate(modelName)` ####

#### `getArgsForDelete(modelName)` ####

#### `resolveById(modelName)` ####

#### `resolveAll(modelName)` ####

#### `resolveCreate(modelName)` ####

#### `resolveUpdate(modelName)` ####

#### `resolveDelete(modelName)` ####

#### `resolveNodeId(modelName)` ####

### `resolveIsTypeOf(modelName)` ####


## Examples ##

An usage example can be found in [example](example) directory.

## Tests ##

The tests are written with [mocha](https://mochajs.org) and can be run with the following command:

```bash
$ npm test
```

To get a code coverage report, run the following command:

```bash
$ npm run cover
```

## License ##

[MIT](LICENSE)
