'use strict';

const expect = require('chai').expect;
const GraysQL = require('graysql');
const graphql = require('graphql');
const GraphQLUtils = require('graphql/utilities');

const FakeTranslator = require('../support/fake-translator');
const MockModels = require('../support/mock-models');
const TestSchema = require('../support/test-schema');


module.exports = function (makeORMLoader) {

  describe('#makeORMLoader(name, translator)', function () {

    it('should only accept an object as a translator', function () {
      expect(() => makeORMLoader('asdfa', 'asdfa')).to.throw(TypeError, /Expected translator to be an object/);
      expect(() => makeORMLoader('asdf', null)).to.throw(TypeError, /Expected translator to be an object/);
      expect(() => makeORMLoader('asdf', undefined)).to.throw(TypeError, /Expected translator to be an object/);
    });

    it('should only accept a string as name', function () {
      expect(() => makeORMLoader({}, new FakeTranslator(MockModels))).to.throw(TypeError, /Expected name to be a string/);
      expect(() => makeORMLoader(null, new FakeTranslator(MockModels))).to.throw(TypeError, /Expected name to be a string/);
      expect(() => makeORMLoader(undefined, new FakeTranslator(MockModels))).to.throw(TypeError, /Expected name to be a string/);
      expect(() => makeORMLoader('', new FakeTranslator(MockModels))).to.throw(TypeError, /Expected name to be a string/);
    });

    it('should accept a valid translator', function () {
      function InvalidTranslator() {};
      expect(() => makeORMLoader('Invalid', new InvalidTranslator())).to.throw(TypeError, /Invalid translator/);
      expect(() => makeORMLoader('Fake', new FakeTranslator(MockModels))).to.not.throw(TypeError, /Invalid translator/);
    });

    describe('#loadFromORM(translator, [options])', function () {

      let GQL;
      beforeEach(function () {
        GQL = new GraysQL();
        GQL.use(makeORMLoader('Fake', new FakeTranslator(MockModels)));
      });

      it('should generate a complete schema', function () {
        GQL.loadFromFakeORM();
        const expected = GraphQLUtils.printSchema(GQL.generateSchema());
        const result = GraphQLUtils.printSchema(TestSchema.Schema);
        expect(result).to.equal(expected);
      });
      it.skip('should generate a valid schema', function (done) {
        GQL.loadFromORM(new FakeTranslator(MockModels));
        const Schema = GQL.generateSchema();
        const query = `query getUser {
          user(id: 1) {
            id,
            nick,
            group {
              id,
              name,
              members: {
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
      it('should generate a complete relay schema when options.relay is true');
      it('should generate a valid schema when options.relay is true');
      it('should not generate create mutations when options.mutations.create is false');
      it('should not generate update mutations when options.mutations.update is false');
      it('should not generate delete mutations when options.mutations.delete is false');
    });
  });


};
