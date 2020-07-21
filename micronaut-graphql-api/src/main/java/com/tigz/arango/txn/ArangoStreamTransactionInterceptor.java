package com.tigz.arango.txn;

import com.arangodb.ArangoDB;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.StreamTransactionEntity;
import com.arangodb.model.StreamTransactionOptions;
import io.micronaut.aop.MethodInterceptor;
import io.micronaut.aop.MethodInvocationContext;
import io.micronaut.configuration.arango.condition.RequiresArango;
import io.micronaut.core.annotation.AnnotationValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Singleton;
import java.util.Objects;

/**
 * Intercept method calls annotated with {@link ArangoStreamTransaction} and wrap them in an
 * ArangoDB Stream Transaction so that multiple db updates are handled in an atomic fashion.
 *
 */
@Singleton
@RequiresArango
@RequiredArgsConstructor
@Slf4j
public class ArangoStreamTransactionInterceptor implements MethodInterceptor<Object,Object> {

    private final ArangoDB arangoDB;

    @Override
    public Object intercept(MethodInvocationContext<Object, Object> context) {
        ArangoDatabase db = arangoDB.db();

        AnnotationValue<ArangoStreamTransaction> txnInfo = context.getAnnotation(ArangoStreamTransaction.class);

        StreamTransactionOptions options = buildStreamTxnOptions(txnInfo);
        StreamTransactionEntity txn = db.beginStreamTransaction(options);
        log.debug("Started stream transaction with id: {}", txn.getId());
        try{
            Object result = context.proceed();
            db.commitStreamTransaction(txn.getId());
            log.debug("Committed stream transaction with id: {}", txn.getId());
            return result;
        }
        catch (Throwable t){
            log.error("problem during arango transaction with id: {} in method: {} - rolling back", txn.getId(), context.getMethodName(), t);
            arangoDB.db().abortStreamTransaction(txn.getId());
            throw t;
        }
    }

    private StreamTransactionOptions buildStreamTxnOptions(AnnotationValue<ArangoStreamTransaction> txnInfo) {

        StreamTransactionOptions options = new StreamTransactionOptions()
                .waitForSync(txnInfo.booleanValue("waitForSync").orElse(false))
                .allowImplicit(txnInfo.booleanValue("allowImplicit").orElse(false));

        String[] readCollections = txnInfo.stringValues("readCollections");
        if ( readCollections.length > 0 ){
            options.readCollections(readCollections);
        }
        String[] writeCollections = txnInfo.stringValues("writeCollections");
        if ( writeCollections.length > 0 ){
            options.writeCollections(writeCollections);
        }
        String[] exclusiveCollections = txnInfo.stringValues("exclusiveCollections");
        if ( exclusiveCollections.length > 0 ){
            options.exclusiveCollections(exclusiveCollections);
        }
        long maxTransactionSize = txnInfo.longValue("maxTransactionSize").orElse(-1);
        if ( maxTransactionSize > 0 ){
            options.maxTransactionSize(maxTransactionSize);
        }
        return options;
    }
}
