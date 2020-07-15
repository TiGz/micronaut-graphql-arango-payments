package com.tigz.graphql.mutation;

import graphql.GraphQL;
import graphql.schema.DataFetcher;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaGenerator;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;
import io.micronaut.context.annotation.Bean;
import io.micronaut.context.annotation.Context;
import io.micronaut.context.annotation.Factory;
import io.micronaut.core.io.ResourceResolver;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Public Mutations are handled directly in Java
 * so that we can have full control over the life-cycle and any
 * events that need to be raised etc or external services that
 * need to be proxied to
 *
 */
@Factory
@Slf4j
public class PublicMutationGraphQLFactory {

    @SuppressWarnings("rawtypes")
    @Bean
    @Singleton
    @Context
    public GraphQL graphQL(ResourceResolver resourceResolver,
                           List<PublicMutationDataFetcher> mutationDataFetchers) {

        SchemaParser schemaParser = new SchemaParser();
        SchemaGenerator schemaGenerator = new SchemaGenerator();

        // Parse the schema.
        TypeDefinitionRegistry typeRegistry = new TypeDefinitionRegistry();
        typeRegistry.merge(schemaParser.parse(new BufferedReader(new InputStreamReader(
                resourceResolver.getResourceAsStream("classpath:publicMutation.graphqls").get()))));

        Map<String, DataFetcher> mutationFetchers = mutationDataFetchers.stream()
                .collect(Collectors.toMap(MutationDataFetcher::getName, Function.identity()));

        log.info("Wiring up {} mutation fetchers", mutationDataFetchers);

        if ( log.isDebugEnabled() ){
            log.debug("*** Mutation Data Fetchers ***");
            mutationDataFetchers.forEach(df -> log.debug(df.getName()));
            log.debug("*** End of Data Fetchers ***");
        }

        // Create the runtime wiring for all the injected data fetchers
        RuntimeWiring wiring = RuntimeWiring.newRuntimeWiring()
                .type("Mutation", tw -> tw.dataFetchers(mutationFetchers))
                .build();

        // Create the executable schema.
        GraphQLSchema graphQLSchema = schemaGenerator.makeExecutableSchema(typeRegistry, wiring);

        // Return the GraphQL bean.
        return GraphQL.newGraphQL(graphQLSchema).build();
    }
}
