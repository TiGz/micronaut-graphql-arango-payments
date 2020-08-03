const gql = require('graphql-sync');
const currencySchema = require('./currencySchema');
const dbDriver = require('../../../database/driver');

module.exports = {

  getCurrencies: {
    type: new gql.GraphQLList(currencySchema.Currency),
    description: 'Return all currencies in the database',
    resolve() {
      return dbDriver.currencyItems.all();
    },
  },

  getCurrencyByCode: {
    type: currencySchema.Currency,
    description: 'Get an Currency by its ID',
    args: {
      code: {
        description: 'The 3 letter currency code',
        type: new gql.GraphQLNonNull(gql.GraphQLString),
      },
    },
    resolve(root, args) {
      return dbDriver.currencyItems.firstExample({
        _key: args.code,
      });
    },
  },
};