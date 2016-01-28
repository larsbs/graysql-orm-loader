'use strict';

const expect = require('chai').expect;
const GraysQL = require('graysql');
const Graylay = require('graysql/extensions/graylay');
const graphql = require('graphql');
const GraphQLUtils = require('graphql/utilities');

const MockTranslator = require('../support/mock-translator');
const MockModels = require('../support/mock-models');
const TestSchema = require('../support/test-schema');
const TestSchemaRelay = require('../support/test-schema-relay');


module.exports = function (ORMLoader) {

  describe('#loadFromORM(translator, [options])', function () {

    let GQL;
    beforeEach(function () {
      GQL = new GraysQL();
      GQL.use(ORMLoader);
    });

    it('should only accept an object as a translator', function () {
      expect(() => GQL.loadFromORM('asdfa')).to.throw(TypeError, /Expected translator to be an object/);
      expect(() => GQL.loadFromORM(null)).to.throw(TypeError, /Expected translator to be an object/);
      expect(() => GQL.loadFromORM(x => x)).to.throw(TypeError, /Expected translator to be an object/);
    });

    it('should accept a valid translator', function () {
      function InvalidTranslator() {};
      expect(() => GQL.loadFromORM(new InvalidTranslator())).to.throw(TypeError, /Invalid translator/);
      expect(() => GQL.loadFromORM(new MockTranslator(MockModels))).to.not.throw(TypeError, /Invalid translator/);
    });

    it('should generate a complete schema', function () {
      GQL.loadFromORM(new MockTranslator(MockModels));
      const expected = GraphQLUtils.printSchema(TestSchema.Schema);
      const result = GraphQLUtils.printSchema(GQL.generateSchema());
      expect(result).to.equal(expected);
    });
    it('should generate a valid schema', function (done) {
      GQL.loadFromORM(new MockTranslator(MockModels));
      const Schema = GQL.generateSchema();
      const query = `query GetUser {
        user(id: 1) {
          id,
          nick,
          group {
            id,
            name,
            members {
              id
            }
          }
        }
      }`;
      const expected = {
        data: {
          user: {
            id: 1,
            nick: 'Lars',
            group: {
              id: 1,
              name: 'Group 1',
              members: [{ id: 1 }, { id: 2 }]
            }
          }
        }
      };
      graphql.graphql(Schema, query)
      .then(result => {
        expect(result).to.deep.equal(expected);
        done();
      })
      .catch(err => done(err));
    });
    it('should generate a complete relay schema when options.relay is true', function () {
      GQL.use(Graylay);
      GQL.loadFromORM(new MockTranslator(MockModels), { relay: true });
      const Schema = GQL.generateSchema();
      const expected = GraphQLUtils.printSchema(TestSchemaRelay.Schema);
      const result = GraphQLUtils.printSchema(Schema);
      expect(result).to.equal(expected);
    });
    it('should generate a valid schema when options.relay is true', function (done) {
      GQL.use(Graylay);
      GQL.loadFromORM(new MockTranslator(MockModels), { relay: true });
      const Schema = GQL.generateSchema();
      const query = `query GetGroup {
        group(id: 1) {
          id,
          name,
          members {
            edges {
              node {
                id,
                nick
              }
            }
          }
        }
      }`;
      const expected = {
        data: {
          group: {
            id: "R3JvdXA6MQ==",
            name: "Group 1",
            members: {
              edges: [{
                node: {
                  id: "VXNlcjox",
                  nick: "Lars"
                }
              }, {
                node: {
                  id: "VXNlcjoy",
                  nick: "Deathvoid"
                }
              }]
            }
          }
        }
      };
      graphql.graphql(Schema, query)
      .then(result => {
        expect(result).to.deep.equal(expected);
        done();
      })
      .catch(err => done(err));
    });
    it('should not generate create mutations when options.mutations.create is false', function () {
      GQL.loadFromORM(new MockTranslator(MockModels), {
        mutations: {
          create: false
        }
      });
      const Schema = GQL.generateSchema();
      const expected = GraphQLUtils.printSchema(TestSchema.Schema).replace(/\n^\s+create.*$/gm, '');
      const result = GraphQLUtils.printSchema(Schema);
      expect(result).to.equal(expected);
    });
    it('should not generate update mutations when options.mutations.update is false', function () {
      GQL.loadFromORM(new MockTranslator(MockModels), {
        mutations: {
          update: false
        }
      });
      const Schema = GQL.generateSchema();
      const expected = GraphQLUtils.printSchema(TestSchema.Schema).replace(/\n^\s+update.*$/gm, '');
      const result = GraphQLUtils.printSchema(Schema);
      expect(result).to.equal(expected);
    });
    it('should not generate delete mutations when options.mutations.delete is false', function () {
      GQL.loadFromORM(new MockTranslator(MockModels), {
        mutations: {
          delete: false
        }
      });
      const Schema = GQL.generateSchema();
      const expected = GraphQLUtils.printSchema(TestSchema.Schema).replace(/\n^\s+delete.*$/gm, '');
      const result = GraphQLUtils.printSchema(Schema);
      expect(result).to.equal(expected);
    });
  });


};
