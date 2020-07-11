const gql = require('graphql-sync');
const paymentRequestSchema = require('./paymentRequestSchema');
const dbDriver = require('../../../database/driver.js');

module.exports = {

  getPaymentRequests: {
    type: new gql.GraphQLList(paymentRequestSchema.PaymentRequest),
    description: 'Return all payment requests in the database',
    resolve() {
      return dbDriver.paymentRequestItems.all();
    },
  },


};