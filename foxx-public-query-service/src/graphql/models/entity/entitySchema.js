const gql = require('graphql-sync');
const dbDriver = require('../../../database/driver');
const countrySchema = require('./../country/countrySchema');

const typeOfEntity = new gql.GraphQLEnumType({
   name: 'TypeOfEntity',
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

module.exports = {

    // entity type
    TypeOfEntity: typeOfEntity,

    Entity: new gql.GraphQLObjectType({
        name: 'Entity',
        description: 'A person or company that can pay or be paid',
        fields() {
          return {
            entityId: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The internal id of the entity',
              resolve(entity) {
                return entity._key;
              },
            },
            name: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The name of the person or company',
            },
            publicEmail: {
              type: new gql.GraphQLNonNull(gql.GraphQLString),
              description: 'The public email address of the person or company - allows searching for people/companies',
            },
            country: {
              type: countrySchema.Country,
              description: 'The country of origin for the person or company',
              resolve(entity) {
                return dbDriver.countryItems.document(entity.countryCode);
              },
            },
            type: {
              type: new gql.GraphQLNonNull(typeOfEntity),
              description: 'The type of the entity: PERSON or COMPANY.'
            },
            dob: {
              type: gql.GraphQLString,
              description: 'yyyy-mm-dd date of birth required for person only'
            }
          };
        },
      })
};