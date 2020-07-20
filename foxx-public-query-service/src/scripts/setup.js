'use strict';
const db = require('@arangodb').db;

// populate our country collection
  const countryCollectionName = 'country';
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
  const currencyCollectionName = 'currency';
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


const graphModule =  require('@arangodb/general-graph');
const graphName = 'payments';


if (graphModule._exists(graphName)) {
  // eslint-disable-next-line no-console
  console.warn(`Graph ${graphName} already exists. Leaving it untouched.`);
}
else {
  graphModule._create(graphName, [

    // creating a relation will automatically create the relevant collections
    // if they do not exist already

    // create the payment_request collection requesting a payment
    // from one entity to be made to another entity
    graphModule._relation(
      'payment_request',
      ['entity'],
      ['entity']
    )
  ]);

  // Let's add some stuff to preload the database

  // populate some entities
  const entityCollection = db._collection('entity');

  // make sure name and email are unique
  entityCollection.ensureIndex({type: 'hash', fields: ['name'], unique: true});
  entityCollection.ensureIndex({type: 'hash', fields: ['publicEmail'], unique: true});

  const entity1 = entityCollection.save({
    _key: "entity1-id",
    name: "Joe Blogs",
    publicEmail: "joe.bloggs@gmail.com",
    countryCode: "US",
    type: "person",
    dob: "1976-06-17"
  });
  const entity2 = entityCollection.save({
    _key: "entity2-id",
    name: "Sam Smith",
    publicEmail: "sam.smith@hotmail.com",
    countryCode: "GB",
    type: "person",
    dob: "1981-12-10"
  });
  const entity3 = entityCollection.save({
    _key: "entity3-id",
    name: "Acme Corporation",
    publicEmail: "payments@acmecorp.com",
    countryCode: "US",
    type: "company"
  });
  const entity4 = entityCollection.save({
    _key: "entity4-id",
    name: "Widgets Inc",
    publicEmail: "payments@widgetsinc.com",
    countryCode: "US",
    type: "company"
  });

  // populate some payment requests
  const paymentRequestCollection = db._collection('payment_request');

  // Acme Corp would like to pay $120 to Joe Bloggs
  paymentRequestCollection.insert({
    _from: entity3._id,
    _to: entity1._id,
    amount: 12000,
    currency: "USD",
    status: "submitted"
  });

  // Sam Smith would like to pay £60 to Widgets Inc
  paymentRequestCollection.insert({
    _from: entity2._id,
    _to: entity4._id,
    amount: 6000,
    currency: "GBP",
    status: "submitted"
  });

  // Acme Corp would like to pay $30 to Sam Smith
  paymentRequestCollection.insert({
    _from: entity3._id,
    _to: entity2._id,
    amount: 3000,
    currency: "USD",
    status: "submitted"
  });

  // Widgets Inc would like to pay $4000 to Acme Corporation
  paymentRequestCollection.insert({
    _from: entity4._id,
    _to: entity3._id,
    amount: 40000,
    currency: "USD",
    status: "submitted"
  });

  // Sam Smith would like to pay £90 to Joe Bloggs
  paymentRequestCollection.insert({
    _from: entity2._id,
    _to: entity1._id,
    amount: 9000,
    currency: "GBP",
    status: "submitted"
  });

  // Acme Corp would like to pay EUR2050 to Widgets Inc
  paymentRequestCollection.insert({
    _from: entity3._id,
    _to: entity4._id,
    amount: 205000,
    currency: "EUR",
    status: "submitted"
  });


}



