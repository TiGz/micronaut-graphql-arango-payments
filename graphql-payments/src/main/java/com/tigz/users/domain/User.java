package com.tigz.users.domain;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Builder
@Getter
@Setter
@EqualsAndHashCode
@SuppressWarnings("Duplicates")
public class User {

    private UUID userId;
    private String provider;
    private String userXid;
    private String name;

}
