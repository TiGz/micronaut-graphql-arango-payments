# Micronaut GraphQL Arango Payments
An exploration into the viability of building a payout based payments system 
with a [GraphQL](https://graphql.org) interface and backed by an [ArangoDB](https://www.arangodb.com) multi-model database.

## Micronaut Bootstrap
I used the [Micronaut Launch](https://micronaut.io/launch/) tool to generate the 
service sub-module with some of the required dependencies.

## Spinning up ArangoDB via Docker Compose
I followed this [blog post](https://dev.to/sonyarianto/how-to-spin-arangodb-server-with-docker-and-docker-compose-3c00)
to configure a docker-compose.yml file to spin up a local ArangoDB database with persistent data volumes.

To bring up a local ArangoDB for development purposes execute the following command:

    docker-compose up -d
    
You can now access the ArangoDB console on [http://localhost:8529](http://localhost:8529)

And login with *root* / *rootpassword*

To stop the container without destroying the apps/data use:

    docker-compose stop
    
To clean up the container and delete apps/data use:

    docker-compose down
    
## Build the Micronaut Service into a docker image running GraalVM

    mvn clean install
    
## Deploy or re-deploy the Foxx Microservice into ArangoDB

First time:

    ./graphql-payment-foxx/redeploy.sh
    
Subsequently:

    ./graphql-payment-foxx/redeploy.sh
    
Now the graphiql interactive console is available at: http://localhost:8529/_db/_system/payments/graphql
    


## Further directions


### Security
There is currently no security on the graph but this is where the graph 
architecture will shine especially bright by allowing us to define 
relations such as IS_MEMBER_OF to link users to groups and HAS_ACCESS_TO 
and OWNED_BY to link users/groups to entities with a particular role.

### Events and Webhooks
Although the Public API is GraphQL based there will still be asynchronous parts of the
system that can be driven by graph updates + events (outbox pattern).
There could be an internal private GraphQL based API for other services to
interact or we could support more traditional REST API updates instead.

Webhooks could extend the system out to external services for accessing the
various payment rails for quotes and instruction.
        

