## Micronaut GraphQL Arango Payments

This is an exploration/poc project and has 2 main purposes:

1) Build a solid [GraphQL](https://graphql.org) API Gateway that can handle mutations directly and proxy queries into [ArangoDB](https://www.arangodb.com) multi-model database
2) Explore how a Payout/Payments API could look if implemented in [GraphQL](https://graphql.org)

It is an example of [GAGA: GraphQL Arango Gateway Architecture](GAGA.md)

### GraphQL API Gateway backed by ArangoDB

The Micronaut service is exposing 2 endpoints that make up the GraphQL API:

#### /api/public/query/graphql

This is the Query endpoint which will authenticate and authorize the invoker (@TODO) before 
forwarding the query into a Foxx microservice which is running inside the ArangoDB instance.
The reason we do this is that the real power of GraphQL can be used while minimising the
network hops to resolve all the leaf fetch operations that might be required to satisfy a
particular query.

#### /api/public/mutation/graphql

This is the Mutation endpoint and it exposes the mutations (updates to the system) allowed by 
the public clients (assuming they invoker has the required permissions)

Each mutation request is handled in the Java layer and can be handled directly
or proxied out to another service or could be raised as an asynchronous event (event sourcing).

### Why use GraphQL?
This is a good article that explains why GraphQL could be a better way of exposing an API:

https://www.altexsoft.com/blog/engineering/graphql-core-features-architecture-pros-and-cons/


### Micronaut Bootstrap
I used the [Micronaut Launch](https://micronaut.io/launch/) tool to generate the 
service sub-module with some of the required dependencies.

### Spinning up ArangoDB via Docker Compose
I followed this [blog post](https://dev.to/sonyarianto/how-to-spin-arangodb-server-with-docker-and-docker-compose-3c00)
to configure a docker-compose.yml file to spin up a local ArangoDB database with persistent data volumes.

To bring up a local ArangoDB for development purposes execute the following command:

    docker-compose up -d
    
You can now access the ArangoDB console on [http://localhost:8529](http://localhost:8529)

And login with *root* / *rootpassword*

To stop the container without destroying the apps/data use:

    docker-compose stop
    
To clean up the container and delete apps/data use:

    docker-compose down && docker volume rm micronaut-graphql-arango-payments_arangodb_apps_data_container micronaut-graphql-arango-payments_arangodb_data_container
    
### Build the Micronaut Service into a docker image running GraalVM

    mvn clean install
    
### Deploy or re-deploy the Foxx Microservice into ArangoDB

First time:

    ./foxx-public-query-service/deploy.sh
    
Subsequently:

    ./foxx-public-query-service/redeploy.sh
    
### Run the service

    cd micronaut-graphql-api
    mvn mn:run

### Query the graph

Use a web browser to go to:

http://localhost:8080/api/public/query/graphql

### Add data to the system via Mutations

Use a web browser to go to:

http://localhost:8080/api/public/mutation/graphiql


### Further directions


#### Security
There is currently no security on the graph but this is where the graph 
architecture will shine especially bright by allowing us to define 
relations such as IS_MEMBER_OF to link users to groups and HAS_ACCESS_TO 
and OWNED_BY to link users/groups to entities with a particular role.

#### Events and Webhooks
Although the Public API is GraphQL based there will still be asynchronous parts of the
system that can be driven by graph updates + events (outbox pattern).
There could be an internal private GraphQL based API for other services to
interact or we could support more traditional REST API updates instead.

Webhooks could extend the system out to external services for accessing the
various payment rails for quotes and instruction.

#### GraphQL Interfaces
We should be able to expand our types to support polymorphism via GraphQL interfaces.
        
### Error Handling

Some good context [here](https://blog.atomist.com/error-handling-in-graphql)
