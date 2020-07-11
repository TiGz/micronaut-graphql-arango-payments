const gql = require('graphql-sync');
const entitySchema = require('./entitySchema');
const dbDriver = require('../../../database/driver.js');

module.exports = {

  getEntities: {
    type: new gql.GraphQLList(entitySchema.Entity),
    description: 'Return all entities in the database',
    resolve() {
      return dbDriver.entityItems.all();
    },
  },

  getEntityById: {
    type: entitySchema.Entity,
    description: 'Get an Entity by its id',
    args: {
      entityId: {
        description: 'The internal entity id',
        type: new gql.GraphQLNonNull(gql.GraphQLString),
      },
    },
    resolve(root, args) {
      return dbDriver.entityItems.firstExample({
        _key: args.entityId,
      });
    },
  },

};