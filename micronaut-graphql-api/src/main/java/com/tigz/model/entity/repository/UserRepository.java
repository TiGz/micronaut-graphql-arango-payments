package com.tigz.model.entity.repository;

import com.tigz.model.entity.domain.User;

public interface UserRepository {
    Iterable<User> findAll();

    User findById(String id);

    User save(User User);

    void deleteById(String id);
}
