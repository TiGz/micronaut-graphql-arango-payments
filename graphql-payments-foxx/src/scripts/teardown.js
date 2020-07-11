'use strict';
const db = require('@arangodb').db;
const graphModule =  require('@arangodb/general-graph');

const collections = [
  'currency',
  'country',
  'entity',
  'payment_request'
  //'account',
  //'payment',
];

for (const localName of collections) {
  const qualifiedName = module.context.collectionName(localName);
  db._drop(qualifiedName);
}
const graphName = module.context.collectionName('payments');
graphModule._drop(graphName);