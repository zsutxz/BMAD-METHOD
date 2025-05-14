# My Go-To Principles for Enterprise Go & Event-Driven Architectures

This isn't just a list; it's a distillation of what works for building scalable, resilient e-commerce systems using Golang on AWS, with Kafka as our eventing backbone. If we're building it, this is the playbook.

## Core Architectural Philosophy

- **Pattern:** Microservices Architecture

  - **My Stance:** Absolutely essential for our e-commerce domains. Non-negotiable for new, significant capabilities.
  - **Why:** We need to scale services independently and avoid monolithic bottlenecks. This is key for team autonomy and speed.
  - **Key Tenet:** Services _must_ map to clear business capabilities. Loose coupling isn't a buzzword; it's a requirement.

- **Pattern:** Event-Driven Architecture (EDA) with Kafka

  - **My Stance:** The default for inter-service comms and any serious asynchronous work.
  - **Why:** It's how we build for resilience and scale. Decoupling through events is critical for evolving the system.
  - **Key Tenets:**
    - Kafka for the core event streams. Don't skimp here.
    - AWS SNS/SQS can be fine for simpler, auxiliary eventing or specific Lambda glue, but Kafka is king for business events.
    - Schema Registry (Confluent or AWS Glue) is **mandatory**. No schema, no merge. This prevents so many downstream headaches.

- **Pattern:** Hexagonal Architecture (Ports and Adapters)

  - **My Stance:** Strongly favored for structuring our Go services.
  - **Why:** Keeps our domain logic pure and shielded from the noise of HTTP, databases, or messaging specifics. Testability skyrockets.

- **Pattern:** API First Design

  - **My Stance:** A hard requirement. We design APIs before we write a line of implementation code.
  - **Why:** Clear contracts save immense integration pain. OpenAPI v3+ is our lingua franca.
  - **Key Tenet:** API docs are generated from these specs, always up-to-date.

- **Pattern:** CQRS (Command Query Responsibility Segregation)
  - **My Stance:** A powerful tool in the toolbox, but not a hammer for every nail.
  - **Why:** Can be fantastic for read-heavy services or where write and read models diverge significantly.
  - **Key Tenet:** Apply judiciously. It adds complexity, so the benefits must be clear and substantial.

## My Tech Stack Defaults

- **Category:** Cloud Provider

  - **Technology:** AWS (Amazon Web Services)
  - **My Stance:** Our strategic platform. All-in.
  - **Why:** Deep enterprise investment, mature services, and the scale we need.
  - **My Go-To AWS Services:**
    - Compute: AWS Lambda is the workhorse for most microservices. AWS Fargate for when Lambda's constraints don't fit (long-running tasks, specific needs).
    - Messaging: Apache Kafka (MSK preferred for managed, but self-hosted on EC2 if we absolutely need knobs MSK doesn't expose). SQS/SNS for Lambda DLQs, simple fan-out.
    - Database:
      - NoSQL: DynamoDB is our first choice for high-throughput services. Its scaling and managed nature are huge wins.
      - Relational: RDS PostgreSQL when the data model is truly relational or we need complex transactions that DynamoDB makes awkward.
      - Caching: ElastiCache for Redis. Standard.
    - API Management: API Gateway. Handles the front door for REST and HTTP APIs.
    - Storage: S3. For everything from static assets to logs to the data lake foundation.
    - Identity: IAM for service roles, Cognito if we're handling customer-facing auth.
    - Observability: CloudWatch (Logs, Metrics, Alarms) and AWS X-Ray for distributed tracing. Non-negotiable.
    - Schema Management: AWS Glue Schema Registry or Confluent. Pick one and stick to it.
    - Container Registry: ECR.

- **Category:** Backend Language & Runtime

  - **Technology:** Golang
  - **My Stance:** The backbone of our new microservice development.
  - **Target Version:** Latest stable (e.g., 1.21+), but we pin the specific minor version in each project's `go.mod`.
  - **Why:** Simplicity, stellar performance, first-class concurrency, and a perfect fit for cloud-native. Lean and mean, especially for Lambda.
  - **Common Go-To Libraries (versions pinned in projects):**
    - HTTP: `chi` is often my preference for its composability, but `gin-gonic` is also solid. Standard `net/http` if it's dead simple.
    - Config: `viper`.
    - Logging: `uber-go/zap` or `rs/zerolog` for structured logging. JSON output is a must.
    - Kafka: `confluent-kafka-go` is robust. `segmentio/kafka-go` is an alternative.
    - AWS: `aws-sdk-go-v2`.
    - Testing: Go's built-in `testing` is great. `testify/assert` and `testify/mock` are standard additions. `golang-migrate` for DB schema.
    - Data/SQL: Stay away from heavy ORMs in Go. `sqlx` is usually sufficient. `sqlc` for generating type-safe Go from SQL is excellent. For DynamoDB, the SDK is the way.

- **Category:** Data Serialization
  - **Format:** Protobuf
    - **My Stance:** The standard for Kafka messages and any gRPC communication.
    - **Why:** Performance, schema evolution capabilities, and strong typing are invaluable.
  - **Format:** JSON
    - **My Stance:** The standard for all REST API payloads (requests/responses).
    - **Why:** It's universal and human-readable.

## My Design & Style Guideposts

- **API Design (RESTful):**

  - **My Stance:** Our primary style for synchronous APIs.
  - **Key Tenets:**
    - Stick to HTTP semantics religiously. Proper methods, proper status codes.
    - Resources are plural nouns. Keep URLs clean and intuitive.
    - Standardized error responses. No exceptions.
    - Services must be stateless.
    - `PUT`/`DELETE` must be idempotent. `POST` should be too, where it makes sense.
    - Versioning via the URI (`/v1/...`). It's just simpler.
    - Auth: OAuth 2.0 (Client Credentials, Auth Code) for external, JWTs internally. API Gateway authorizers are your friend.

- **Infrastructure as Code (IaC):**

  - **Tool:** HashiCorp Terraform
  - **My Stance:** The only way we manage infrastructure.
  - **Why:** Declarative, battle-tested, and we have a solid module library built up.
  - **Key Tenets:** Reusable Terraform modules are critical. State in S3 with DynamoDB locking.

- **Concurrency (Golang):**

  - **My Stance:** Leverage Go's strengths but with discipline.
  - **Key Tenets:** Goroutines and channels are powerful; use them wisely. Worker pools for controlled concurrency. Graceful shutdown is a must for all services.

- **Error Handling (Golang):**

  - **My Stance:** Go's explicit error handling is a feature, not a bug. Embrace it.
  - **Key Tenets:** Always return errors. Wrap errors with `fmt.Errorf` using `%w` (or a lib) to add context. Log errors with correlation IDs. Distinguish clearly between retryable and fatal errors.

- **Testing:**

  - **My Stance:** Non-negotiable and integral to development, not an afterthought.
  - **Key Tenets:**
    - Unit Tests: Cover all critical logic. Mock external dependencies without mercy.
    - Integration Tests: Verify interactions (e.g., service-to-DB, service-to-Kafka). Testcontainers or localstack are invaluable here.
    - Contract Tests (Events): Especially for Kafka. Ensure your producers and consumers agree on the schema _before_ runtime.
    - E2E Tests: For the critical business flows, API-driven.

- **Observability:**

  - **My Stance:** If you can't observe it, you can't own it.
  - **Key Tenets:** Structured JSON logging. Correlation IDs threaded through everything. Key operational metrics (rates, errors, latency, consumer lag) via CloudWatch. AWS X-Ray for tracing.

- **Security:**

  - **My Stance:** Built-in, not bolted on. Everyone's responsibility.
  - **Key Tenets:** Least privilege for all IAM roles. Secrets in AWS Secrets Manager. Rigorous input validation at all boundaries. Automated vulnerability scanning (Go modules, containers). Static analysis (`go vet`, `staticcheck`, `gosec`).

- **Development Workflow:**
  - **My Stance:** Smooth, automated, and predictable.
  - **Key Tenets:** Git is a given. Trunk-Based Development is generally preferred for our microservices. CI/CD (GitHub Actions, GitLab CI, or Jenkins - whatever the enterprise standard is) must be robust: lint, static analysis, all test types, build, deploy.
  - Docker for local dev consistency and Fargate. Lambda gets zip packages.

## Essential Cross-Cutting Practices

- **Configuration Management:**

  - **My Stance:** No magic strings or hardcoded settings in the codebase. Ever.
  - **Key Tenets:** Externalize via environment variables, AWS Parameter Store, or AppConfig. Config is environment-specific.

- **Resiliency & Fault Tolerance:**
  - **My Stance:** Design for failure. It _will_ happen.
  - **Key Tenets:** Retries (with exponential backoff & jitter) for transient issues. Circuit breakers for flaky dependencies. DLQs for Kafka messages that just won't process. Sensible timeouts everywhere.
