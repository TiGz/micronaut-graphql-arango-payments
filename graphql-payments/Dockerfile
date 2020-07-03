FROM oracle/graalvm-ce:20.1.0-java11 as graalvm
RUN gu install native-image

COPY . /home/app/graphql-payments
WORKDIR /home/app/graphql-payments

RUN native-image --no-server -cp target/graphql-payments-*.jar

FROM frolvlad/alpine-glibc
RUN apk update && apk add libstdc++
EXPOSE 8080
COPY --from=graalvm /home/app/graphql-payments/graphql-payments /app/graphql-payments
ENTRYPOINT ["/app/graphql-payments"]
