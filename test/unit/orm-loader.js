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


module.exports = function (makeORMLoader) {

  describe('#makeORMLoader(name, translator)', function () {

    it('should only accept an object as a translator', function () {
      expect(() => makeORMLoader('asdfa', 'asdfa')).to.throw(TypeError, /Expected translator to be an object/);
      expect(() => makeORMLoader('asdf', null)).to.throw(TypeError, /Expected translator to be an object/);
      expect(() => makeORMLoader('asdf', undefined)).to.throw(TypeError, /Expected translator to be an object/);
    });

    it('should only accept a string as name', function () {
      expect(() => makeORMLoader({}, new MockTranslator(MockModels))).to.throw(TypeError, /Expected name to be a string/);
      expect(() => makeORMLoader(null, new MockTranslator(MockModels))).to.throw(TypeError, /Expected name to be a string/);
      expect(() => makeORMLoader(undefined, new MockTranslator(MockModels))).to.throw(TypeError, /Expected name to be a string/);
      expect(() => makeORMLoader('', new MockTranslator(MockModels))).to.throw(TypeError, /Expected name to be a string/);
    });

    it('should accept a valid translator', function () {
      function InvalidTranslator() {};
      expect(() => makeORMLoader('Invalid', new InvalidTranslator())).to.throw(TypeError, /Invalid translator/);
      expect(() => makeORMLoader('Mock', new MockTranslator(MockModels))).to.not.throw(TypeError, /Invalid translator/);
    });

    describe('#loadFromORM([options])', function () {

      let GQL;
      beforeEach(function () {
        GQL = new GraysQL();
        GQL.use(makeORMLoader('Mock', new MockTranslator(MockModels)));
      });

      it('should generate a complete schema', function () {
        GQL.loadFromMockORM();
        const expected = GraphQLUtils.printSchema(TestSchema.Schema);
        const result = GraphQLUtils.printSchema(GQL.generateSchema());
        expect(result).to.equal(expected);
      });
      it('should generate a valid schema', function (done) {
        GQL.loadFromMockORM();
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
        GQL.loadFromMockORM({ relay: true });
        const Schema = GQL.generateSchema();
        const expected = GraphQLUtils.printSchema(TestSchemaRelay.Schema);
        const result = GraphQLUtils.printSchema(Schema);
        expect(result).to.equal(expected);
      });
      it('should generate a valid schema when options.relay is true', function (done) {
        GQL.use(Graylay);
        GQL.loadFromMockORM({ relay: true });
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
        GQL.loadFromMockORM({
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
        GQL.loadFromMockORM({
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
        GQL.loadFromMockORM({
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
  });


};
