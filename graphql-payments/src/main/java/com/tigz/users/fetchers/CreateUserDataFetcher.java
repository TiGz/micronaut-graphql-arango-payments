package com.tigz.users.fetchers;

import com.tigz.graphql.MutationDataFetcher;
import com.tigz.users.domain.User;
import com.tigz.users.repository.UserRepository;
import graphql.schema.DataFetchingEnvironment;
import lombok.RequiredArgsConstructor;

import javax.inject.Singleton;

@Singleton
@RequiredArgsConstructor
@SuppressWarnings("Duplicates")
public class CreateUserDataFetcher implements MutationDataFetcher<User> {
    private final UserRepository userRepository;

    @Override
    public User get(DataFetchingEnvironment env) throws Exception {
        User user = User.builder()
                .name(env.getArgument("name"))
                .provider(env.getArgument("provider"))
                .userXid(env.getArgument("userXid"))
                .build();

        return userRepository.save(user);
    }

    @Override
    public String getName() {
        return "createUser";
    }
}
