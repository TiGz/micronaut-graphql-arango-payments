'use strict';
// The graphql-sync module is a thin wrapper around graphql-js
// which provides an identical API except it doesn't use promises
// and instead always resolves synchronously. This allows us to
// use it in Foxx (which doesn't support async resolution).
const gql = require('graphql-sync');
// If you want to use graphql-sync in your own Foxx services
// make sure to install it in the Foxx service's folder using
// the "npm" command-line tool and to include the "node_modules"
// folder when bundling your Foxx service for deployment.
const db = require('@arangodb').db;

// Using module.context.collection allows us to use the
// collection with a common prefix based on where the service
// is mounted. This way we can have multiple copies of this
// service mounted on the same database without worrying about
// name conflicts in their collections.

// Some simplifications
// 1) not worrying too much about permissions at this stage
// but they will be modelled as edges between users and entities
// and we might want to add organisations too

// Vertex Collections (nodes)

// countries
const countries = module.context.collection('countries');

// currencies
const currencies = module.context.collection('currencies');

// users of the system can be granted access to/ownership of entities
const users = module.context.collection('users');

// A person or company that can pay and be paid (owners of accounts)
const entities = module.context.collection('entities');

// accounts that receive funds and hold funds for paying from
const accounts = module.context.collection('accounts');

// payout requests - full document, will also add individual payment_request items
const payouts = module.context.collection('payouts');

// each payout contains at least one logical payment request
const paymentRequests = module.context.collection('payment_requests');



// Edge collections (edges connect _from one vertex collection _to another)

// each payment is _from an account _to an account and is associated with a specific payment request
const payments = module.context.collection('payments');

// enum types

// entity type
const entityTypeType = new gql.GraphQLEnumType({
  name: 'EntityType',
  description: 'Type of entity: PERSON or COMPANY',
  values: {
    PERSON: {
      value: 'person', // The internal value stored in ArangoDB
      description: 'A human person that can pay or be paid'
    },
    COMPANY: {
      value: 'company',
      description: 'A company or organisation that can pay or be paid'
    }
  }
});

// vertex types

const countryType = new gql.GraphQLObjectType({
  name: 'Country',
  description: 'A nation of the world with its own government, occupying a particular territory',
  fields() {
    return {
      code: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The iso-3166 alpha-2-code of the country.',
        resolve(doc) {
          return doc._key;
        }
      },
      // These fields directly correspond to properties
      // on the documents and thus don't need "resolve"
      // methods.
      name: {
        type: gql.GraphQLString,
        description: 'The name of the country.'
      }
    };
  }
});

const currencyType = new gql.GraphQLObjectType({
  name: 'Currency',
  description: 'Monetary systems from around the world and online',
  fields() {
    return {
      code: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'Mostly ISO 4217 3 letter currency codes but could be extended to 3 or 4 letter cyptocurrency codes.',
        resolve(doc) {
          return doc._key;
        }
      },
      // These fields directly correspond to properties
      // on the documents and thus don't need "resolve"
      // methods.
      name: {
        type: gql.GraphQLString,
        description: 'The name of the currency.'
      }
    };
  }
});

const userType = new gql.GraphQLObjectType({
  name: 'User',
  description: 'A user within the system',
  fields() {
    return {
      userId: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'our internal ID for the user',
        resolve(doc) {
          return doc._key;
        }
      },
      userXid: {
        type: gql.GraphQLString,
        description: 'The external id of the user'
      },
      name: {
        type: gql.GraphQLString,
        description: 'The name of the user.'
      },
      email: {
        type: gql.GraphQLString,
        description: 'The email address of the user.'
      }
    };
  }
});

let entityType;

entityType = new gql.GraphQLInterfaceType({
  name: 'Entity',
  description: 'A entity that can pay and be paid',
  fields() {
    return {
      entityId: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The internal id of the entity.'
      },
      entityXid: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The external id of the entity.'
      },
      entityType: {
        type: new gql.GraphQLNonNull(entityType),
        description: 'The type of the entity: PERSON or COMPANY.'
      },
      name: {
        type: gql.GraphQLString,
        description: 'The name of the entity.'
      }
    };
  },
  resolveType(entity) {
    // person entities and company entities have different fields.
    // The "$type" property allows GraphQL to decide which
    // GraphQL type a document should correspond to.
    return entity.$type === 'person' ? personEntityType : companyEntityType;
  }
});

entityType = new gql.GraphQLObjectType({
  name: 'Entity',
  description: 'An individual person or a company who can pay and be paid',
  fields() {
    return {
      entityId: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The id of the entity',
        resolve(doc) {
          return doc._key;
        }
      },
      entityXid: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The external id of the entity.'
      },
      entityType: {
        type: new gql.GraphQLNonNull(entityTypeType),
        description: 'The type of entity: PERSON or COMPANY',
        resolve(doc) {
          return doc.$type;
        }
      },
      name: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The name of the person or company.'
      },
      dob: {
        type: gql.GraphQLString,
        description: 'date of birth of the person in ISO 8601 date format (yyyy-mm-dd)'
      }
    };
  }
});

const queryType = new gql.GraphQLObjectType({
  name: 'Query',
  fields() {
    return {
      entities: {
          type: entityType,
          resolve(root, args) {
            return db._query(aqlQuery`
                FOR entity IN ${entities}
                RETURN entity
          `).toArray();
          }
        }
    };
  }
});

// This is the GraphQL schema object we need to execute
// queries. See "controller.js" for an example of how it
// is used. Also see the "test" folder for more in-depth
// examples.
module.exports = new gql.GraphQLSchema({
  query: queryType
});