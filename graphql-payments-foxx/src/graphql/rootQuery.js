const gql = require('graphql-sync');
const currencyQuery = require('./models/currency/currencyQuery');
const countryQuery = require('./models/country/countryQuery');
const entityQuery = require('./models/entity/entityQuery');

const rootFields = Object.assign({},
  currencyQuery,
  countryQuery,
  entityQuery
);

module.exports = new gql.GraphQLObjectType({
  name: 'RootQuery',
  fields: () => rootFields
});