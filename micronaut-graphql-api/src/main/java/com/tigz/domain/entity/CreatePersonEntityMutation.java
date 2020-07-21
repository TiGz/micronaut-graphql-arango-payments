package com.tigz.domain.entity;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDB;
import com.arangodb.entity.BaseDocument;
import com.arangodb.entity.DocumentCreateEntity;
import com.arangodb.model.DocumentCreateOptions;
import com.tigz.arango.CollectionName;
import com.tigz.arango.txn.ArangoStreamTransaction;
import com.tigz.service.MutationLog;
import com.tigz.graphql.mutation.PublicMutationDataFetcher;
import graphql.schema.DataFetchingEnvironment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.UUID;

@Singleton
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("Duplicates")
public class CreatePersonEntityMutation implements PublicMutationDataFetcher<String> {

    private final ArangoDB arangoDB;
    private final MutationLog mutationLog;

    @ArangoStreamTransaction(writeCollections = {"entity","mutation_log"})
    @Override
    public String get(DataFetchingEnvironment env) throws Exception {
        String entityId = UUID.randomUUID().toString();
        HashMap<String, Object> doc = new HashMap<>(env.getArguments());
        doc.put("type", "person");
        doc.put("createdAt", OffsetDateTime.now(ZoneId.of("UTC")).toString());

        // create doc using our own key
        BaseDocument entity = new BaseDocument(entityId);
        entity.setProperties(doc);

        ArangoCollection entities = arangoDB.db().collection(CollectionName.entity.name());
        DocumentCreateEntity<BaseDocument> created = entities.insertDocument(entity, new DocumentCreateOptions().returnNew(true));

        log.debug("Added new person entity with entityId: {} and public email: {}", entityId, entity.getAttribute("publicEmail"));

        // add to the mutation log in the same transaction
        // this could be used for an outbox pattern to emit events to kafka etc
        mutationLog.logCreated(CollectionName.entity, created.getKey(), created.getNew());

        return created.getKey();
    }

    @Override
    public String getName() {
        return "createPersonEntity";
    }
}
