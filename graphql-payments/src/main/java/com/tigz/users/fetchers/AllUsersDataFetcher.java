package com.tigz.users.fetchers;

import com.tigz.graphql.QueryDataFetcher;
import com.tigz.users.domain.User;
import com.tigz.users.repository.UserRepository;
import graphql.schema.DataFetchingEnvironment;
import lombok.RequiredArgsConstructor;

import javax.inject.Singleton;

@Singleton
@RequiredArgsConstructor
@SuppressWarnings("Duplicates")
public class AllUsersDataFetcher implements QueryDataFetcher<Iterable<User>> {
    private final UserRepository userRepository;

    @Override
    public Iterable<User> get(DataFetchingEnvironment env) throws Exception {
        return userRepository.findAll();
    }

    @Override
    public String getName() {
        return "users";
    }
}
