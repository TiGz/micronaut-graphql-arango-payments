## Public GraphQL Query Payments API Foxx Microservice

This module is a [Foxx Microservice](https://www.arangodb.com/docs/stable/foxx.html)
implemented in Javascript which is deployed into the ArangoDB instance and is therefore
co-located with the data in the primary payments graph. 

It provides a GraphQL endpoint for querying the publicly available 
payments data and the graphiql browser is available at:

The data graph contains the following so far:

* Entities - Each Person or Company that can pay or be paid
* Payment Requests - A request for one entity to pay an amount to another
* Currencies - Valid currencies in the system
* Countries - Valid countries in the system

### Building and deployment

As part of the main maven build:

    mvn install

we will end up with a zip file here:

    target/foxx-public-query-service-0.1.zip
    
This is the deployable foxx microservice module and can be deployed into a 
running ArangoDB instance using the console etc

For convenience during development we provide 2 scripts also that will deploy
or redeploy into the local dockerised arangodb.

    ./deploy.sh

and

    /.redeploy.sh    
    