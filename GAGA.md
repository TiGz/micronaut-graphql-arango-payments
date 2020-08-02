# Going GAGA for RAD 
Introducing a new extensible architecture for rapid application development that can scale up and out from initial simple monolith to multi-team micro-services and presents 2 separate GraphQL Schemas - one for querying and another for making updates (mutations).

## GraphQL/Arango Gateway Architecture (GAGA)

![GAGA initial deployment architecture](https://docs.google.com/drawings/d/e/2PACX-1vQyRN9sufngxyCOUwG9rFVMrJJkaXoNVDeG5fSeC-FdzkTmWmRmjNt5We7R98V5v--mWpOEQNkf57J3/pub?w=889&h=320)


### Why GraphQL is a better choice than REST for a new API
Here is a [great intro to GraphQL](https://www.imaginarycloud.com/blog/graphql-vs-rest) which goes into much more depth than I will here.

The main advantages of a GraphQL combine to create both a superior client application development experience and a more performant mobile/web app:
* The schema defines the interface between client and server in a standardised manner
* The schema is fully and interactively explorable via the GraphIQL explorer/console
* Each client is in full control of the data they request which makes for a faster UI 
	* No over/under fetching problem
	* Populate an entire page with multiple data queries in a single client query

Here is an example of GraphiQL in action with the Github API:

![Github GraphiQL Example](https://cdn.netlify.com/eddf10853729b584702312eb5b83d2e9c00e7f30/b5ca8/img/blog/graphiql-example.gif)

### How GAGA handles the GraphQL query performance problem
Usually the main problem with building a friendly GraphQL API is that it can be easy to build a schema that allows clients to ask for lots of data that involves lots of leaf fetches. 
For example, a client might query a list of Payments and for each payment in the result set the client could be asking for details about both the Person receiving the Payment and the Company sending the payment. 
Usually this would mean the GraphQL application layer would first query the database for the list of Payments and would then iterate through the list and make a subsequent query into the database for each Person and for each Company. 
This can easily lead to an explosion of network round trips, elongated search times and can really hurt performance and scalability.

GAGA's solution to this problem is to leverage [ArangoDB](https://www.arangodb.com/) which is just a brilliant bit of [both product design and technical engineering](https://www.tutorialspoint.com/arangodb/arangodb_advantages.htm).

One of Arango's secret weapons is that you can install arbitrary Javascript code into a microservice layer that sits on top of the database so that it can execute co-located with the data.

So for GAGA we create a GraphQL [Foxx Microservice](https://www.arangodb.com/docs/stable/foxx.html) which we then deploy into ArangoDB and we proxy incoming query requests through to it so that each leaf fetch is co-located with the data and the whole response is packaged up and sent back with a single network hop. This strategy allows us to vastly reduce query time for complex queries and to handle much more throughput generally.

### Extensibility and how GAGA does CQRS
Mutations are not directly proxied into ArangoDB as there is no performance issue here. So in essence we are implementing the [Command Query Responsibility Segregation](https://microservices.io/patterns/data/cqrs.html) pattern. The ArangoDB instance always handles the queries but the mutations can be handled in a number of ways including:
* The gateway service updates ArangoDB directly
* The gateway forwards an update to another microservice
* The gateway emits an event (event sourcing)
* All of the above at the same time (for different mutations)

How the query database ends up being updated will depend on the scaling requirements of the system as well as the complexity of the application and the team or teams building it.

At the beginning of a new project it probably makes most sense to treat the system as a simple monolith and have the gateway service update the query database directly. As the project matures and other requirements are added it may then be better to break out one or more mutations into seprarate services. In this way, GAGA naturally sets up the team for success by making evolution and iteration quite simple and straightforward.

One possible evolution might look like this:

![enter image description here](https://docs.google.com/drawings/d/e/2PACX-1vR6BRz86soqMTh1PjPu9K-kttaM82ppxXN34xGlMpyXLlHlw_8Qin6u-Huok_-YGeidc9kIrdM-BwBS/pub?w=889&h=567)

### Micronaut and ArangoDB Transactions for the win
The power of Micronaut is in it's super quick start up time and the ability to build GraalVM native images that allow you to deploy services onto scale-to-zero FaaS style platforms and have sub-second spin up times.

Another great feature of Micronaut is how easily it is it wire up annotation driven aspects. Unlike most other NoSQL databases, ArangoDB supports [ACID transactions](https://www.arangodb.com/docs/stable/transactions.html) so here is an example of adding ArangoDB transaction management via an annotation:

	@Documented
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ElementType.METHOD})
	@Around
	@Type(ArangoStreamTransactionInterceptor.class)
	public @interface ArangoStreamTransaction {
		boolean waitForSync() default false;
		String[] readCollections() default {};
		String[] writeCollections() default {};
		String[] exclusiveCollections() default {};
		boolean allowImplicit() default false;
		long maxTransactionSize() default -1;
	}

    @Singleton
	public class ArangoStreamTransactionInterceptor implements MethodInterceptor<Object,Object> {
		private final ArangoDB arangoDB;
		
		public Object intercept(MethodInvocationContext<Object, Object> context) {
			ArangoDatabase db = arangoDB.db();
			AnnotationValue<ArangoStreamTransaction> txnInfo = context.getAnnotation(ArangoStreamTransaction.class);
			StreamTransactionOptions options = buildStreamTxnOptions(txnInfo);
			StreamTransactionEntity txn = db.beginStreamTransaction(options);
			try{
				Object result = context.proceed();
				db.commitStreamTransaction(txn.getId());
				return result;
			}
			catch (Throwable t){
				log.error("problem during arango transaction with id: {} in method: {} - rolling back", txn.getId(), context.getMethodName(), t);
				arangoDB.db().abortStreamTransaction(txn.getId());
				throw t;
			}
		}
	}
Which allows us to handle mutations by both updating the primary entity collection and also adding to a mutation_log collection which can then be used for an [outbox pattern event emitter](https://microservices.io/patterns/data/transactional-outbox.html) so that those mutations can be picked up and acted upon asynchronously:

    @Singleton
	public class SubmitPaymentRequestMutation implements PublicMutationDataFetcher<String> {
		private final SubmitPaymentRequestService submitPaymentRequestService;
	
		@ArangoStreamTransaction(writeCollections = {"payment_request","mutation_log"})
		public String get(DataFetchingEnvironment env) throws Exception {
			HashMap<String, Object> requestAttributes = new HashMap<>(env.getArgument("request"));
			PaymentRequest paymentRequest = PaymentRequest.of(requestAttributes);
			return submitPaymentRequestService.submitPaymentRequest(paymentRequest);
		}
		public String getName() {
			return "submitPaymentRequest";
		}
	}
The service method will write to both the **payment_request** collection and then the **mutation_log** collection but it will do it atomically in a transaction and will rollback if either is unsuccessful. In this way we can build solid and reliable event based services not normally associated with non-relational databases.

### Summary
In this article we have shown how a new gateway based architecture could leverage the power of GraphQL while retaining high levels of query performance and how it would support both rapid application development in the initial phase of a project while also providing the flexibility to mature into a micro-services based CQRS style system without impacting the clients too much.

### Example Github Repo
This is a POC project that shows the initial deployment architecture in action in an imagined payments platform: [https://github.com/TiGz/micronaut-graphql-arango-payments](https://github.com/TiGz/micronaut-graphql-arango-payments)