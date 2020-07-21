const gql = require('graphql-sync');
const dbDriver = require('../../../database/driver');
const entitySchema = require('./../entity/entitySchema');
const currencySchema = require('./../currency/currencySchema');

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
     CANCELLED: {
       value: 'cancelled', // The internal value stored in ArangoDB
       description: 'The state if the request is cancelled by the owner of the request'
     },
     INSTRUCTED: {
       value: 'instructed', // The internal value stored in ArangoDB
       description: 'A state of the request after it has been instructed'
     }
   }
 });

const paymentTransmissionHint = new gql.GraphQLEnumType({
   name: 'PaymentTransmissionHint',
   description: 'A hint to help decide how the payment should be transmitted',
   values: {
     LOWEST_COST: {
       value: 'lowest_cost', // The internal value stored in ArangoDB
       description: 'Pursue the cheapest rails options at the expense of time spent in transmission.'
     },
     BALANCED: {
       value: 'balanced', // The internal value stored in ArangoDB
       description: 'Balance time to send versus cost. This is the default option.'
     },
     FASTEST: {
       value: 'fastest', // The internal value stored in ArangoDB
       description: 'Choose the fastest transmission path possible potentially at additional expense.'
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
              type: new gql.GraphQLNonNull(entitySchema.Entity),
              description: 'The entity providing the funds for the payment',
              resolve(paymentRequest) {
                return dbDriver.entityItems.document(paymentRequest._from);
              },
            },
            payee: {
              type: new gql.GraphQLNonNull(entitySchema.Entity),
              description: 'The entity receiving the funds of the payment',
              resolve(paymentRequest) {
                return dbDriver.entityItems.document(paymentRequest._to);
              },
            },
            onBehalfOf: {
              type: entitySchema.Entity,
              description: 'Optional entity that the payment appears to come from instead of the payor',
              resolve(paymentRequest) {
                if ( paymentRequest.onBehalfOfEntityId != null ){
                    return dbDriver.entityItems.document(paymentRequest.onBehalfOfEntityId);
                }
                else{
                    return null;
                }
              },
            },
            submittedAt: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The timestamp that the payment request was submitted'
            },
            amount: {
              type: new gql.GraphQLNonNull(gql.GraphQLInt),
              description: 'The amount of the payment in minor units as an integer',
            },
            currency: {
              type: new gql.GraphQLNonNull(currencySchema.Currency),
              description: 'The currency of the desired amount for the payment',
              resolve(paymentRequest) {
                return dbDriver.currencyItems.document(paymentRequest.currency);
              },
            },
            paymentReference: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The reference of the payment in the external system (e.g. invoice id etc)'
            },
            memo: {
              type: gql.GraphQLString,
              description: 'Optional long form arbitrary text attached to this payment'
            },
            transmissionHint: {
              type: new gql.GraphQLNonNull(paymentTransmissionHint),
              description: 'A hint to help decide how the payment should be transmitted: LOWEST_COST, BALANCED or FASTEST'
            },
            desiredArrivalDateTime: {
              type: gql.GraphQLString,
              description: 'Optional desired payment arrival date/time'
            },
            status: {
              type: new gql.GraphQLNonNull(paymentRequestStatus),
              description: 'The current status of the payment request: SUBMITTED, REJECTED, CANCELLED or INSTRUCTED.'
            },
            rejectedReason: {
              type: gql.GraphQLString,
              description: 'The reason for the payment being rejected if it was'
            }
          };
        },
      })
};