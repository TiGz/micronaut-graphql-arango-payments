package com.tigz.graphql.mutation;

import graphql.schema.DataFetcher;

public interface NamedDataFetcher<T> extends DataFetcher<T> {

    String getName();
}
