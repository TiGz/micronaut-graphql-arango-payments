package com.tigz.users.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Builder
@Getter
@Setter
public class User {

    private UUID userId;
    private String provider;
    private String userXid;
    private String name;

}
