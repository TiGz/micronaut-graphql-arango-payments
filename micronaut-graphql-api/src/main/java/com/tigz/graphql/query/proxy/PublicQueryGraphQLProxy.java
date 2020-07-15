package com.tigz.graphql.query.proxy;

import com.tigz.properties.ArangoProperties;
import io.micronaut.core.async.publisher.Publishers;
import io.micronaut.core.util.StringUtils;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.client.ProxyHttpClient;
import io.micronaut.http.filter.OncePerRequestHttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import lombok.RequiredArgsConstructor;
import org.reactivestreams.Publisher;

/**
 * Proxy Query requests arriving at /api/public/query/graphql through to the
 * Foxx Microservice running inside ArangoDB which will handle the
 * query in a much more efficient manner than could be handled in
 * the java layer.
 *
 * @TODO add in security to check the incoming auth token and map it
 * to a user in the db, we could add an extra header to the request
 * and the Foxx microservice could pull it out. The auth on the DB is
 * done with basic auth but that is global access and not per user access.
 */
@Filter("/api/public/query/graphql")
@RequiredArgsConstructor
public class PublicQueryGraphQLProxy extends OncePerRequestHttpServerFilter {
    private final ProxyHttpClient client;
    private final ArangoProperties arangoProperties;

    @Override
    protected Publisher<MutableHttpResponse<?>> doFilterOnce(HttpRequest<?> request, ServerFilterChain chain) {
        return Publishers.map(client.proxy(
                request.mutate()
                        .uri(b -> b
                                .scheme("http")
                                .host(arangoProperties.getHost())
                                .port(arangoProperties.getPort())
                                .replacePath(StringUtils.prependUri(
                                        arangoProperties.getServicePaths().getPublicGraphqlQuery(),
                                        request.getPath().substring("/api/public/query/graphql".length())
                                ))
                        )
                        .header("Authorization", arangoProperties.authHeader())
        ), response -> response);
    }
}
