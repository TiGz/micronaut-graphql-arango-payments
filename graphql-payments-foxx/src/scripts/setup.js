'use strict';
const db = require('@arangodb').db;

const graphModule =  require('@arangodb/general-graph');
const graphName = module.context.collectionName('payments');

if (graphModule._exists(graphName)) {
  // eslint-disable-next-line no-console
  console.warn(`Graph ${graphName} already exists. Leaving it untouched.`);
}
else {
  graphModule._create(graphName, [
    graphModule._relation(
      module.context.collectionName('payment_request'),
      [module.context.collectionName('entity')],
      [module.context.collectionName('entity')]
    )
  ]);

  // populate some entities

  const entityCollection = module.context.collection('entity');
  const entity1 = entityCollection.save({
    _key: "entity1-id",
    name: "Joe Blogs",
    type: "person",
    dob: "1976-06-17"
  });
  const entity2 = entityCollection.save({
    _key: "entity2-id",
    name: "Sam Smith",
    type: "person",
    dob: "1981-12-10"
  });
  const entity3 = entityCollection.save({
    _key: "entity3-id",
    name: "Acme Corporation",
    type: "company"
  });
  const entity4 = entityCollection.save({
    _key: "entity4-id",
    name: "Widgets Inc",
    type: "company"
  });

  // populate some payment requests
  const paymentRequestCollection = module.context.collection('payment_request');

  // Acme Corp would like to pay $120 to Joe Bloggs
  paymentRequestCollection.insert({
    _from: entity3._id,
    _to: entity1._id,
    amount: 12000,
    currency: "USD"
  });

  // Sam Smith would like to pay £60 to Widgets Inc
  paymentRequestCollection.insert({
    _from: entity2._id,
    _to: entity4._id,
    amount: 6000,
    currency: "GBP"
  });

  // Acme Corp would like to pay $30 to Sam Smith
  paymentRequestCollection.insert({
    _from: entity3._id,
    _to: entity2._id,
    amount: 3000,
    currency: "USD"
  });

  // Widgets Inc would like to pay $4000 to Acme Corporation
  paymentRequestCollection.insert({
    _from: entity4._id,
    _to: entity3._id,
    amount: 40000,
    currency: "USD"
  });

  // Sam Smith would like to pay £90 to Joe Bloggs
  paymentRequestCollection.insert({
    _from: entity2._id,
    _to: entity1._id,
    amount: 9000,
    currency: "GBP"
  });

  // Acme Corp would like to pay EUR2050 to Widgets Inc
  paymentRequestCollection.insert({
    _from: entity3._id,
    _to: entity4._id,
    amount: 205000,
    currency: "EUR"
  });


}

  // Let's add some stuff to preload the database

// populate our country collection
const countryCollectionName = module.context.collectionName('country');
if (!db._collection(countryCollectionName)) {
  const countryItems = db._createDocumentCollection(countryCollectionName);
  [
    {_key: 'FR', name: 'France'},
    {_key: 'GB', name: 'United Kingdom of Great Britain and Northern Ireland'},
    {_key: 'US', name: 'United States of America'}
  ].forEach(function (doc) {
    countryItems.save(doc);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${countryCollectionName} already exists. Leaving it untouched.`);
}

// populate our currency collection
const currencyCollectionName = module.context.collectionName('currency');
if (!db._collection(currencyCollectionName)) {
  const currencyItems = db._createDocumentCollection(currencyCollectionName);
  [
    {_key: 'GBP', name: 'British Pound'},
    {_key: 'USD', name: 'US Dollar'},
    {_key: 'EUR', name: 'Euro'}
  ].forEach(function (doc) {
    currencyItems.save(doc);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${countryCollectionName} already exists. Leaving it untouched.`);
}

