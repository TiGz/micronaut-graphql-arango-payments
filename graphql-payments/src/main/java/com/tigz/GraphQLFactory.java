package com.tigz;

import com.tigz.users.service.UserService;
import graphql.GraphQL;
import graphql.schema.GraphQLSchema;
import io.leangen.graphql.GraphQLSchemaGenerator;
import io.micronaut.context.annotation.Bean;
import io.micronaut.context.annotation.Factory;

import javax.inject.Singleton;

@Factory
public class GraphQLFactory {

    @Bean
    @Singleton
    public GraphQL graphQL(UserService userService) {

        // Create the executable schema.
        GraphQLSchema graphQLSchema = new GraphQLSchemaGenerator()
                .withOperationsFromSingleton(userService)
                .generate();

        // Return the GraphQL bean.
        return GraphQL.newGraphQL(graphQLSchema).build();
    }
}
