const gql = require('graphql-sync');
const countrySchema = require('./countrySchema');
const dbDriver = require('../../../database/driver.js');

module.exports = {

  getCountries: {
    type: new gql.GraphQLList(countrySchema.Country),
    description: 'Return all countries in the database',
    resolve() {
      return dbDriver.countryItems.all();
    },
  },

  getCountryByCode: {
    type: countrySchema.Country,
    description: 'Get an Country by its 2 letter country code',
    args: {
      code: {
        description: 'The 2 letter country code',
        type: new gql.GraphQLNonNull(gql.GraphQLString),
      },
    },
    resolve(root, args) {
      return dbDriver.countryItems.firstExample({
        _key: args.code,
      });
    },
  },

};