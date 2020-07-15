const gql = require('graphql-sync');
const currencyQuery = require('./models/currency/currencyQuery');
const countryQuery = require('./models/country/countryQuery');
const entityQuery = require('./models/entity/entityQuery');
const paymentRequestQuery = require('./models/paymentRequest/paymentRequestQuery');

const rootFields = Object.assign({},
  currencyQuery,
  countryQuery,
  entityQuery,
  paymentRequestQuery
);

module.exports = new gql.GraphQLObjectType({
  name: 'RootQuery',
  fields: () => rootFields
});