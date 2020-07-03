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
public class UpdateUserDataFetcher implements MutationDataFetcher<Boolean> {
    private final UserRepository userRepository;

    @Override
    public Boolean get(DataFetchingEnvironment env) throws Exception {
        String id = env.getArgument("userId");
        User user = userRepository.findById(id);
        if (user != null) {
            if ( env.containsArgument("name") ){
                user.setName(env.getArgument("name"));
            }
            userRepository.save(user);
            return true;
        } else {
            return false;
        }

    }

    @Override
    public String getName() {
        return "updateUser";
    }
}
