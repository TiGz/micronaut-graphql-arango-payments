package com.tigz.graphql;

import graphql.schema.DataFetcher;

public interface NamedDataFetcher<T> extends DataFetcher<T> {

    String getName();
}
