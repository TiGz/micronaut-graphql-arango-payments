package com.tigz.service;

import com.arangodb.ArangoDB;
import com.arangodb.entity.BaseDocument;
import com.tigz.arango.CollectionName;
import io.micronaut.configuration.arango.condition.RequiresArango;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.UUID;

/**
 * Log all mutations to the mutation_log collection
 * This could be used for an outbox style event emitter
 */
@Singleton
@RequiresArango
@RequiredArgsConstructor
@Slf4j
public class MutationLog {

    private final ArangoDB arangoDB;

    public void logCreated(CollectionName collection, String key, Object document){
        String mutationId = UUID.randomUUID().toString();
        BaseDocument mutation = new BaseDocument(mutationId);
        mutation.addAttribute("type", "created");
        mutation.addAttribute("collection", collection.name());
        mutation.addAttribute("documentKey", key);
        mutation.addAttribute("timestamp", OffsetDateTime.now(ZoneId.of("UTC")).toString());
        mutation.addAttribute("emitted", false);
        mutation.addAttribute("newDocument", document);
        arangoDB.db().collection(CollectionName.mutation_log.name()).insertDocument(mutation);
        log.debug("created new document in collection: {} with key:{}", collection, key);
    }

    public void logUpdated(CollectionName collection, String key, Object newDocument, Object oldDocument){
        String mutationId = UUID.randomUUID().toString();
        BaseDocument mutation = new BaseDocument(mutationId);
        mutation.addAttribute("type", "updated");
        mutation.addAttribute("collection", collection.name());
        mutation.addAttribute("documentKey", key);
        mutation.addAttribute("timestamp", OffsetDateTime.now(ZoneId.of("UTC")).toString());
        mutation.addAttribute("emitted", false);
        mutation.addAttribute("newDocument", newDocument);
        mutation.addAttribute("oldDocument", oldDocument);
        arangoDB.db().collection(CollectionName.mutation_log.name()).insertDocument(mutation);
        log.debug("updated document in collection: {} with key:{}", collection, key);
    }

    public void logDeleted(CollectionName collection, String key){
        String mutationId = UUID.randomUUID().toString();
        BaseDocument mutation = new BaseDocument(mutationId);
        mutation.addAttribute("type", "deleted");
        mutation.addAttribute("collection", collection.name());
        mutation.addAttribute("documentKey", key);
        mutation.addAttribute("timestamp", OffsetDateTime.now(ZoneId.of("UTC")).toString());
        mutation.addAttribute("emitted", false);
        arangoDB.db().collection(CollectionName.mutation_log.name()).insertDocument(mutation);
        log.debug("deleted document from collection: {} with key:{}", collection, key);
    }

}
