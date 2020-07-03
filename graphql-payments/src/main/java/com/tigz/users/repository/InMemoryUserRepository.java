package com.tigz.users.repository;

import com.tigz.users.domain.User;

import javax.inject.Singleton;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Singleton
public class InMemoryUserRepository {

    private Map<UUID, User> users = new LinkedHashMap<>();

    public InMemoryUserRepository(){
        //save()
    }

    public Iterable<User> findAll() {
        return users.values();
    }

    public User findById(String id) {
        return users.get(id);
    }

    public User save(User User) {
        if (User.getId() == null) {
            User.setId(UUID.randomUUID());
        }
        users.put(User.getId(), User);
        return User;
    }

    public void deleteById(String id) {
        users.remove(id);
    }
    
}
