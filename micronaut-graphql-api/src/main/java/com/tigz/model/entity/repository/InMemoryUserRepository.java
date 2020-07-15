package com.tigz.model.entity.repository;

import com.tigz.model.entity.domain.User;

import javax.inject.Singleton;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Singleton
public class InMemoryUserRepository implements UserRepository {

    private Map<UUID, User> users = new LinkedHashMap<>();

    public InMemoryUserRepository(){
        save(User.builder().name("Fred One").provider("default").userXid("fredone-xid").build());
        save(User.builder().name("Joey Two").provider("default").userXid("joeytwo-xid").build());
        save(User.builder().name("Alice Three").provider("default").userXid("alicethree-xid").build());
    }

    @Override
    public Iterable<User> findAll() {
        return users.values();
    }

    @Override
    public User findById(String id) {
        return users.get(id);
    }

    @Override
    public User save(User User) {
        if (User.getUserId() == null) {
            User.setUserId(UUID.randomUUID());
        }
        users.put(User.getUserId(), User);
        return User;
    }

    @Override
    public void deleteById(String id) {
        users.remove(id);
    }
    
}
