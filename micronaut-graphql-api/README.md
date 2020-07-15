## Micronaut GraphQL API
This Micronaut service acts as an API Gateway for public and private query
and mutation GraphQL APIs

The Query requests are forwarded into ArangoDB for more efficient handling
closer to the data.

The Mutation requests are handled either directly within this service or
they could be proxied out to another service or they could be turned into
async events (event sourcing)

## Start service with incremental compilation

Any change to source code will immediately re-compile and re-start the service. Cool!

    mvn mn:run

