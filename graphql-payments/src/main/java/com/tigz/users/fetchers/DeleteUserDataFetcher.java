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
public class DeleteUserDataFetcher implements MutationDataFetcher<Boolean> {
    private final UserRepository userRepository;

    @Override
    public Boolean get(DataFetchingEnvironment env) {
        String id = env.getArgument("userId");
        User user = userRepository.findById(id);
        if (user != null) {
            userRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public String getName() {
        return "deleteUser";
    }
}
