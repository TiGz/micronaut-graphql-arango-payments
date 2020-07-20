const db = require('@arangodb').db;
const graphModule =  require('@arangodb/general-graph');

const paymentsGraphName = 'payments';
const paymentsGraph = graphModule._graph(paymentsGraphName);

const entityItems = paymentsGraph['entity'];
const paymentRequestItems = paymentsGraph['payment_request'];

//const accountItems = paymentsGraph[module.context.collectionName('account')];
//const paymentItems = paymentsGraph[module.context.collectionName('payment')];

const currencyItems = db._collection('currency');
const countryItems = db._collection('country');

console.log("Exporting db driver items...")

module.exports = {
  db: db,
  currencyItems: currencyItems,
  countryItems: countryItems,
  entityItems: entityItems,
  paymentRequestItems: paymentRequestItems,
  //accountItems: accountItems,
  //paymentItems: paymentItems,
  paymentsGraph: paymentsGraph,
};