package com.tigz.domain.paymentrequest;

import com.arangodb.ArangoDB;
import com.arangodb.entity.BaseDocument;
import com.arangodb.entity.BaseEdgeDocument;
import com.arangodb.entity.DocumentCreateEntity;
import com.arangodb.model.DocumentCreateOptions;
import com.tigz.arango.CollectionName;
import com.tigz.service.MutationLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;
import java.util.Map;
import java.util.UUID;

@Singleton
@RequiredArgsConstructor
@Slf4j
public class SubmitPaymentRequestService {

    private final ArangoDB arangoDB;
    private final MutationLog mutationLog;

    private final DocumentCreateOptions CREATE_OPTIONS = new DocumentCreateOptions().returnNew(true);

    public String submitPaymentRequest(Map<String,Object> attrs) {
        String payorEntityId = (String) attrs.remove("payorEntityId");
        String payeeEntityId = (String) attrs.remove("payeeEntityId");

        BaseEdgeDocument document = new BaseEdgeDocument(attrs);
        document.setFrom("entity/"+payorEntityId);
        document.setTo("entity/"+payeeEntityId);

        DocumentCreateEntity<BaseEdgeDocument> newDoc = arangoDB.db().collection(CollectionName.payment_request.name()).insertDocument(document,CREATE_OPTIONS);
        mutationLog.logCreated(CollectionName.payment_request, newDoc.getKey(), newDoc);
        return newDoc.getKey();
    }
}
