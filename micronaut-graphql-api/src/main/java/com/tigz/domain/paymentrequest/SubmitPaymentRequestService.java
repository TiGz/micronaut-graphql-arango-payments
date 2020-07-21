package com.tigz.domain.paymentrequest;

import com.arangodb.ArangoDB;
import com.tigz.service.MutationLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;

@Singleton
@RequiredArgsConstructor
@Slf4j
public class SubmitPaymentRequestService {

    private final ArangoDB arangoDB;
    private final MutationLog mutationLog;

    public String submitPaymentRequest(PaymentRequest paymentRequest) {
        // TODO fetch entity ids to populate _to and _from etc
        return null;
    }
}
