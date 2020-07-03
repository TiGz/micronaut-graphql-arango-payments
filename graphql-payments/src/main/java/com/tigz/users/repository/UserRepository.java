package com.tigz.users.repository;

import com.tigz.users.domain.User;

public interface UserRepository {
    Iterable<User> findAll();

    User findById(String id);

    User save(User User);

    void deleteById(String id);
}
