package com.tigz.arango.txn;

import io.micronaut.aop.Around;
import io.micronaut.context.annotation.Type;

import java.lang.annotation.*;

/**
 * Annotate methods that require an ArangoDB Transaction to ensure multiple db operations are performed
 * as a single atomic action. See https://www.arangodb.com/docs/stable/http/transaction-stream-transaction.html
 *
 */

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
@Around
@Type(ArangoStreamTransactionInterceptor.class)
public @interface ArangoStreamTransaction {

    /**
     * waitForSync - an optional boolean flag that, if set, will force the transaction to write all data to disk before returning
     * @return
     */
    boolean waitForSync() default false;

    /**
     * read - contains the array of collection-names to be used in the transaction (mandatory) for read
     * @return
     */
    String[] readCollections() default {};

    /**
     * write - contains the array of collection-names to be used in the transaction (mandatory) for write
     * @return
     */
    String[] writeCollections() default {};

    /**
     * exclusive - contains the array of collection-names to be used in the transaction (mandatory) for exclusive write
     * @return
     */
    String[] exclusiveCollections() default {};

    /**
     * allowImplicit - Allow reading from undeclared collections.
     * @return
     */
    boolean allowImplicit() default false;


    /**
     * maxTransactionSize - Transaction size limit in bytes. Honored by the RocksDB storage engine only.
     * @return
     */
    long maxTransactionSize() default -1;

}
