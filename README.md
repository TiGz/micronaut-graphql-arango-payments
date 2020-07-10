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
    
## Deploy the Foxx Microservice into ArangoDB

    ./graphql-payment-foxx/redeploy.sh
    
        

