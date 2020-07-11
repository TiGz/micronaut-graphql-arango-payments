const db = require('@arangodb').db;
const graphModule =  require('@arangodb/general-graph');

const paymentsGraphName = module.context.collectionName('payments');
const paymentsGraph = graphModule._graph(paymentsGraphName);

const entityItems = paymentsGraph[module.context.collectionName('entity')];
const paymentRequestItems = paymentsGraph[module.context.collectionName('payment_request')];

//const accountItems = paymentsGraph[module.context.collectionName('account')];
//const paymentItems = paymentsGraph[module.context.collectionName('payment')];

const currencyItems = module.context.collection('currency');
const countryItems = module.context.collection('country');

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