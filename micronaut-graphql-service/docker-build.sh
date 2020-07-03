#!/bin/sh
docker build . -t micronaut-graphql-arango-payments
echo
echo
echo "To run the docker container execute:"
echo "    $ docker run -p 8080:8080 micronaut-graphql-arango-payments"
