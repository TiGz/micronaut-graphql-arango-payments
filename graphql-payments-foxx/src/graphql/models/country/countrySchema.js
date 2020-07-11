const gql = require('graphql-sync');
const dbDriver = require('../../../database/driver');

module.exports = {

    Country: new gql.GraphQLObjectType({
        name: 'Country',
        description: 'A nation of the world',
        fields() {
          return {
            code: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The id of the country  - 2 letter code.',
              resolve(country) {
                return country._key;
              },
            },
            name: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The name of the country.',
            }
          };
        },
      })


};