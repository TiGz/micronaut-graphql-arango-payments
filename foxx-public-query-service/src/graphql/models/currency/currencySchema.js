const gql = require('graphql-sync');
const dbDriver = require('../../../database/driver');

module.exports = {

    Currency: new gql.GraphQLObjectType({
        name: 'Currency',
        description: 'A currency',
        fields() {
          return {
            code: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The 3 letter currency code.',
              resolve(currency) {
                return currency._key;
              },
            },
            name: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The name of the currency.',
            }
          };
        },
      })


};