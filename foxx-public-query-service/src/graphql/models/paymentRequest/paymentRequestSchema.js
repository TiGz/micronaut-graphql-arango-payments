const gql = require('graphql-sync');
const dbDriver = require('../../../database/driver');
const entitySchema = require('./../entity/entitySchema');

const paymentRequestStatus = new gql.GraphQLEnumType({
   name: 'PaymentRequestStatus',
   description: 'The status of a payment request',
   values: {
     SUBMITTED: {
       value: 'submitted', // The internal value stored in ArangoDB
       description: 'The initial state after successful submission'
     },
     REJECTED: {
       value: 'rejected', // The internal value stored in ArangoDB
       description: 'The state if the request is rejected for some reason'
     },
     INSTRUCTED: {
       value: 'instructed', // The internal value stored in ArangoDB
       description: 'A state of the request after it has been instructed'
     }
   }
 });

module.exports = {

    // entity type
    PaymentRequestStatus: paymentRequestStatus,

    PaymentRequest: new gql.GraphQLObjectType({
        name: 'PaymentRequest',
        description: 'A request for one entity to pay some money to another entity',
        fields() {
          return {
            payor: {
              type: entitySchema.Entity,
              description: 'The entity providing the funds for the payment',
              resolve(paymentRequest) {
                return dbDriver.entityItems.document(paymentRequest._from);
              },
            },
            payee: {
              type: entitySchema.Entity,
              description: 'The entity receiving the funds of the payment',
              resolve(paymentRequest) {
                return dbDriver.entityItems.document(paymentRequest._to);
              },
            },
            amount: {
              type: new gql.GraphQLNonNull(gql.GraphQLInt),
              description: 'The amount of the payment in minor units as an integer',
            },
            currency: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The currency of the desired amount for the payment'
            },
            status: {
              type: new gql.GraphQLNonNull(paymentRequestStatus),
              description: 'The current status of the payment request: SUBMITTED, REJECTED or INSTRUCTED.'
            },
            rejectedReason: {
              type: gql.GraphQLString,
              description: 'The reason for the payment being rejected if it was'
            }
          };
        },
      })
};