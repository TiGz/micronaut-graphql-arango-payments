package com.tigz.users.domain;

import io.leangen.graphql.annotations.GraphQLNonNull;
import io.leangen.graphql.annotations.GraphQLQuery;
import lombok.Builder;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Builder
@EqualsAndHashCode
@SuppressWarnings("Duplicates")
public class User {

    private UUID id;
    private String provider;
    private String xid;
    private String name;

    @GraphQLQuery(name = "id")
    public @GraphQLNonNull UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    @GraphQLQuery(name = "provider")
    public @GraphQLNonNull String getProvider() {
        return provider;
    }


    public void setProvider(String provider) {
        this.provider = provider;
    }

    @GraphQLQuery(name = "xid")
    public @GraphQLNonNull String getXid() {
        return xid;
    }

    public void setXid(String xid) {
        this.xid = xid;
    }

    @GraphQLQuery(name = "name")
    public @GraphQLNonNull String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
