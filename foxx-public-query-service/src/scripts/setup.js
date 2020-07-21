'use strict';
const db = require('@arangodb').db;

// create mutation_log collection for outbox pattern and audit trail
  const mutationLogCollection = 'mutation_log';
  if (!db._collection(mutationLogCollection)) {
    db._createDocumentCollection(mutationLogCollection);
  } else if (module.context.isProduction) {
    console.warn(`collection ${mutationLogCollection} already exists. Leaving it untouched.`);
  }

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
    submittedAt: "2020-07-21T16:27:18Z",
    amount: 12000,
    currency: "USD",
    paymentReference: "invoice1234-1",
    memo: "Invoice from Joe Bloggs re: some chickens",
    transmissionHint: "lowest_cost",
    status: "submitted"
  });

  // Sam Smith would like to pay £60 to Widgets Inc
  paymentRequestCollection.insert({
    _from: entity2._id,
    _to: entity4._id,
    submittedAt: "2020-07-21T16:27:18Z",
    amount: 6000,
    currency: "GBP",
    paymentReference: "invoice1234-2",
    memo: "Invoice from Sam Smite - app revenue",
    transmissionHint: "balanced",
    status: "submitted"
  });

  // Acme Corp would like to pay $30 to Sam Smith on Behalf of Widgets Inc
  paymentRequestCollection.insert({
    _from: entity3._id,
    _to: entity2._id,
    onBehalfOfEntityId: entity4._id,
    submittedAt: "2020-07-21T16:27:18Z",
    amount: 3000,
    currency: "USD",
    paymentReference: "invoice1234-3",
    memo: "Paying Sam Smith $30 for some nice earrings on behalf of Widgets Inc",
    transmissionHint: "lowest_cost",
    status: "submitted"
  });

  // Widgets Inc would like to pay $4000 to Acme Corporation
  paymentRequestCollection.insert({
    _from: entity4._id,
    _to: entity3._id,
    submittedAt: "2020-07-21T16:27:18Z",
    amount: 40000,
    currency: "USD",
    paymentReference: "invoice1234-4",
    memo: "Invoice from Acme Corp for services rendered",
    transmissionHint: "fastest",
    desiredArrivalDateTime: "2020-08-21T16:27:18Z",
    status: "submitted"
  });

  // Sam Smith would like to pay £90 to Joe Bloggs
  paymentRequestCollection.insert({
    _from: entity2._id,
    _to: entity1._id,
    submittedAt: "2020-07-21T16:27:18Z",
    amount: 9000,
    currency: "GBP",
    paymentReference: "invoice1234-5",
    memo: "Sam Smith would like to pay £90 to Joe Bloggs",
    transmissionHint: "lowest_cost",
    status: "submitted"
  });

  // Acme Corp would like to pay EUR2050 to Widgets Inc
  paymentRequestCollection.insert({
    _from: entity3._id,
    _to: entity4._id,
    submittedAt: "2020-07-21T16:27:18Z",
    amount: 205000,
    currency: "EUR",
    paymentReference: "invoice1234-6",
    memo: "Acme Corp would like to pay EUR2050 to Widgets Inc",
    transmissionHint: "fastest",
    status: "submitted"
  });


}



