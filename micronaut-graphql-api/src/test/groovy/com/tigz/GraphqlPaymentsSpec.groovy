package com.tigz

import graphql.GraphQL
import io.micronaut.runtime.EmbeddedApplication
import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification
import javax.inject.Inject

@MicronautTest
class GraphqlPaymentsSpec extends Specification {

    @Inject
    EmbeddedApplication application

    void 'test it works'() {
        expect:
        application.running
        application.applicationContext.findBean(GraphQL.class).isPresent()

    }

}