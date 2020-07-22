package com.tigz.domain.paymentrequest;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDB;
import com.arangodb.entity.BaseDocument;
import com.arangodb.entity.DocumentCreateEntity;
import com.arangodb.model.DocumentCreateOptions;
import com.tigz.arango.CollectionName;
import com.tigz.arango.txn.ArangoStreamTransaction;
import com.tigz.graphql.mutation.PublicMutationDataFetcher;
import com.tigz.service.MutationLog;
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
public class SubmitPaymentRequestMutation implements PublicMutationDataFetcher<String> {
    
    private final SubmitPaymentRequestService submitPaymentRequestService;

    @ArangoStreamTransaction(writeCollections = {"payment_request","mutation_log"})
    @Override
    public String get(DataFetchingEnvironment env) throws Exception {
        HashMap<String, Object> requestAttributes = new HashMap<>(env.getArgument("request"));
        return submitPaymentRequestService.submitPaymentRequest(requestAttributes);
    }

    @Override
    public String getName() {
        return "submitPaymentRequest";
    }
}
