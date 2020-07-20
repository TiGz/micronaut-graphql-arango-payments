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
  db._drop(localName);
}
const graphName = 'payments';
graphModule._drop(graphName);