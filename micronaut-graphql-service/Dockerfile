FROM oracle/graalvm-ce:20.1.0-java11 as graalvm
RUN gu install native-image

COPY . /home/app/micronaut-graphql-arango-payments
WORKDIR /home/app/micronaut-graphql-arango-payments

RUN native-image --no-server -cp target/micronaut-graphql-arango-payments-*.jar

FROM frolvlad/alpine-glibc
RUN apk update && apk add libstdc++
EXPOSE 8080
COPY --from=graalvm /home/app/micronaut-graphql-arango-payments/micronaut-graphql-arango-payments /app/micronaut-graphql-arango-payments
ENTRYPOINT ["/app/micronaut-graphql-arango-payments"]
