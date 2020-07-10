'use strict';
const db = require('@arangodb').db;

// populate our countries collection
const countriesCollectionName = module.context.collectionName('countries');
if (!db._collection(countriesCollectionName)) {
  const countries = db._createDocumentCollection(countriesCollectionName);
  [
    {_key: 'FR', name: 'France'},
    {_key: 'UK', name: 'United Kingdom of Great Britain and Northern Ireland'},
    {_key: 'US', name: 'United States of America'}
  ].forEach(function (doc) {
    countries.save(doc);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${countriesCollectionName} already exists. Leaving it untouched.`);
}

// populate our currencies collection
const currenciesCollectionName = module.context.collectionName('currencies');
if (!db._collection(currenciesCollectionName)) {
  const currencies = db._createDocumentCollection(currenciesCollectionName);
  [
    {_key: 'GBP', name: 'British Pound'},
    {_key: 'USD', name: 'US Dollar'},
    {_key: 'EUR', name: 'Euro'}
  ].forEach(function (doc) {
    currencies.save(doc);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${countriesCollectionName} already exists. Leaving it untouched.`);
}

// populate our users collection
const usersCollectionName = module.context.collectionName('users');
if (!db._collection(usersCollectionName)) {
  const users = db._createDocumentCollection(usersCollectionName);
  [
    {_key: 'userId1', userXid:'userXid1', name: 'Joe Blogs', email: 'joe.blogs@example.com' },
    {_key: 'userId2', userXid:'userXid2', name: 'Sam Smith', email: 'sam.smith@example.com' }
  ].forEach(function (doc) {
    users.save(doc);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${usersCollectionName} already exists. Leaving it untouched.`);
}

// populate our entities collection
const entitiesCollectionName = module.context.collectionName('entities');
if (!db._collection(entitiesCollectionName)) {
  const entities = db._createDocumentCollection(entitiesCollectionName);
  [
    {_key: 'entityId1', entityXid:'entityXid1', name: 'Joe Blogs', $type: 'person', dob: '1976-06-17' },
    {_key: 'entityId2', entityXid:'entityXid2', name: 'Sam Smith', $type: 'person', dob: '1976-06-17' },
    {_key: 'entityId3', entityXid:'entityXid3', name: 'Acme Corporation', $type: 'company' },
    {_key: 'entityId4', entityXid:'entityXid4', name: 'Widgets Corporation', $type: 'company' }
  ].forEach(function (doc) {
    entities.save(doc);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${entitiesCollectionName} already exists. Leaving it untouched.`);
}
