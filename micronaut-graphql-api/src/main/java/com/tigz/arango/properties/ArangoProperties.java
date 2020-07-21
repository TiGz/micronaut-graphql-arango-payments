package com.tigz.arango.properties;

import io.micronaut.context.annotation.ConfigurationProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.Base64;

/**
 *
 * arangodb:
 *   host: localhost                   # default
 *   port: 8529                        # default
 *   database: _system                 # default
 *   user: root                        # default
 *   password: rootpassword            # or no pass if auth is not required
 *   createDatabaseIfNotExist: false   # default - false
 *
 */
@ConfigurationProperties("arangodb")
@Getter
@Setter
public class ArangoProperties {

    private String host;
    private Integer port;
    private String database;
    private String user;
    private String password;

    private FoxxServicePaths servicePaths;

    private String authHeader;

    public String authHeader(){
        if ( authHeader == null ){
            authHeader = "Basic " + Base64.getEncoder().encodeToString(("" + user + ":" + password).getBytes());
        }
        return authHeader;
    }

    @ConfigurationProperties("servicePaths")
    @Getter
    @Setter
    public static class FoxxServicePaths {
        private String publicGraphqlQuery;
    }
}
