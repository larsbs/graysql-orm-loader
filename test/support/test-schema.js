'use strict';

const graphql = require('graphql');
const DB = require('./db');


const User = new graphql.GraphQLObjectType({
  name: 'User',
  isTypeOf: obj => obj instanceof DB.User,
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    nick: { type: graphql.GraphQLString },
    group: { type: Group }
  })
});


const Group = new graphql.GraphQLObjectType({
  name: 'Group',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    members: { type: new graphql.GraphQLList(User) }
  })
});


const Query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    group: {
      type: Group,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
      },
      resolve: (_, args) => DB.getGroup(args.id)
    },
    groups: {
      type: Group,
      resolve: (_, args) => DB.getGroups()
    },
    user: {
      type: User,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
      },
      resolve: (_, args) => DB.getUser(args.id)
    },
    users: {
      type: User,
      resolve: (_, args) => DB.getUsers()
    }
  })
});


const Mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createGroup: {
      type: Group,
      args: {
        name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, args) => ({ id: 5, nick: args.name })
    },
    updateGroup: {
      type: Group,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, args) => ({ id: args.id, name: args.name })
    },
    deleteGroup: {
      type: Group,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
      },
      resolve: (_, args) => DB.getGroup(args.id)
    },
    createUser: {
      type: User,
      args: {
        nick: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, args) => ({ id: 5, nick: args.nick })
    },
    updateUser: {
      type: User,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        nick: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, args) => ({ id: args.id, nick: args.nick })
    },
    deleteUser: {
      type: User,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
      },
      resolve: (_, args) => DB.getUser(args.id)
    }
  })
});


const Schema = new graphql.GraphQLSchema({
  query: Query,
  mutation: Mutation
});


module.exports = {
  User,
  Group,
  Query,
  Schema
};
