package com.tigz.domain.paymentrequest;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDB;
import com.arangodb.entity.*;
import com.arangodb.model.DocumentCreateOptions;
import com.tigz.arango.CollectionName;
import com.tigz.service.MutationLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Singleton
@RequiredArgsConstructor
@Slf4j
public class SubmitPaymentRequestService {

    private final ArangoDB arangoDB;
    private final MutationLog mutationLog;

    private final DocumentCreateOptions CREATE_OPTIONS = new DocumentCreateOptions().returnNew(true);

    public List<String> submitPaymentRequests(List<Map<String,Object>> list) {
        List<BaseEdgeDocument> docs = new ArrayList<>();
        list.forEach(attrs -> {
            String payorEntityId = (String) attrs.remove("payorEntityId");
            String payeeEntityId = (String) attrs.remove("payeeEntityId");

            BaseEdgeDocument document = new BaseEdgeDocument(attrs);
            document.setFrom("entity/"+payorEntityId);
            document.setTo("entity/"+payeeEntityId);
            docs.add(document);
        });

        ArangoCollection paymentRequests = arangoDB.db().collection(CollectionName.payment_request.name());
        MultiDocumentEntity<DocumentCreateEntity<BaseEdgeDocument>> newDocs = paymentRequests.insertDocuments(docs,CREATE_OPTIONS);

        newDocs.getDocuments().forEach(newDoc -> mutationLog.logCreated(CollectionName.payment_request, newDoc.getKey(), newDoc));
        return newDocs.getDocuments().stream().map(DocumentEntity::getKey).collect(Collectors.toList());
    }
}
