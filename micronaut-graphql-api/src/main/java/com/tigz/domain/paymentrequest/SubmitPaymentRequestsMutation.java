package com.tigz.domain.paymentrequest;

import com.tigz.arango.txn.ArangoStreamTransaction;
import com.tigz.graphql.mutation.PublicMutationDataFetcher;
import graphql.schema.DataFetchingEnvironment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Singleton
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("Duplicates")
public class SubmitPaymentRequestsMutation implements PublicMutationDataFetcher<List<String>> {
    
    private final SubmitPaymentRequestService submitPaymentRequestService;

    @ArangoStreamTransaction(writeCollections = {"payment_request","mutation_log"})
    @Override
    public List<String> get(DataFetchingEnvironment env) throws Exception {
        List<Map<String, Object>> list = env.getArgument("requests");
        List<Map<String, Object>> mutable = list.stream().map(LinkedHashMap::new).collect(Collectors.toList());
        return submitPaymentRequestService.submitPaymentRequests(mutable);
    }

    @Override
    public String getName() {
        return "submitPaymentRequests";
    }
}
