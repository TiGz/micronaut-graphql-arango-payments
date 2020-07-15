const gql = require('graphql-sync');

const rootQuery = require('./rootQuery');

module.exports = new gql.GraphQLSchema({
  query: rootQuery
});