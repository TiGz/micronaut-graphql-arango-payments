package com.tigz.domain.entity;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDB;
import com.arangodb.entity.BaseDocument;
import com.arangodb.entity.DocumentCreateEntity;
import com.tigz.graphql.mutation.MutationDataFetcher;
import com.tigz.graphql.mutation.PublicMutationDataFetcher;
import graphql.schema.DataFetchingEnvironment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;
import java.util.HashMap;
import java.util.UUID;

@Singleton
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("Duplicates")
public class CreateCompanyEntityDataFetcher implements PublicMutationDataFetcher<String> {
    
    private final ArangoDB arangoDB;

    @Override
    public String get(DataFetchingEnvironment env) throws Exception {

        BaseDocument entity = new BaseDocument(UUID.randomUUID().toString());
        entity.setProperties(new HashMap<>(env.getArguments()));
        entity.addAttribute("type", "company");

        ArangoCollection entities = arangoDB.db().collection("entity");
        DocumentCreateEntity<BaseDocument> created = entities.insertDocument(entity);

        log.debug("Added new person entity with entityId: {} and name: {}", created.getKey(), entity.getAttribute("name"));

        return entity.getKey();
    }

    @Override
    public String getName() {
        return "createCompanyEntity";
    }
}
