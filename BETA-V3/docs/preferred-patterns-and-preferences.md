# User-Defined Preferred Patterns and Preferences

This document is intended for you, the user, to maintain a list of your preferred architectural patterns, design choices, technologies, or specific configurations. The Architect Agent will consult this file, when available, to understand your preferences and will aim to incorporate them into its recommendations, still seeking your confirmation.

You can evolve this document over time as you discover new patterns, solidify your preferences, or wish to guide the Architect Agent more specifically for certain types of projects, platforms, languages, or architectural styles.

## How to Use This Document

- **List Your Preferences:** Add entries below detailing specific patterns, technologies, or approaches you favor.
- **Provide Context/Rationale (Optional but Recommended):** Briefly explain _why_ you prefer a certain pattern or technology. This helps the Architect Agent understand the underlying reasons and apply the preference more intelligently.
- **Specify Scope (Optional):** If a preference is specific to a certain context (e.g., "For serverless Node.js projects," "For frontend applications requiring real-time updates"), please note that.
- **Keep it Updated:** As your preferences evolve, update this document.

## Example Preferences (Illustrative - Please Replace with Your Own)

---

### General Architectural Patterns

- **Pattern:** Microservices Architecture

  - **Preference Level:** Strongly Preferred for large, complex applications.
  - **Rationale:** Promotes scalability, independent deployment, and technology diversity.
  - **Notes:** Consider event-driven communication (e.g., Kafka, RabbitMQ) for inter-service communication where appropriate.

- **Pattern:** Hexagonal Architecture (Ports and Adapters)
  - **Preference Level:** Preferred for core business logic components.
  - **Rationale:** Enhances testability and decouples business logic from infrastructure concerns.

---

### Technology Preferences

- **Category:** Cloud Provider

  - **Technology:** AWS (Amazon Web Services)
  - **Preference Level:** Preferred
  - **Rationale:** Familiarity with the ecosystem, extensive service offerings.
  - **Specific Services to Favor (if applicable):**
    - Compute: Lambda for serverless, EC2 for general purpose, EKS for Kubernetes.
    - Database: RDS (PostgreSQL), DynamoDB.
    - Storage: S3.

- **Category:** Backend Language/Framework

  - **Technology:** Python with FastAPI
  - **Preference Level:** Strongly Preferred for new API development.
  - **Rationale:** Performance, ease of development, modern features.

- **Category:** Frontend Framework
  - **Technology:** React with TypeScript
  - **Preference Level:** Preferred
  - **Rationale:** Component-based architecture, strong community support, type safety.

---

### Design Choices & Styles

- **Factories and Facades:** Especially for third party APIs or libraries

  - Use Facades around APIs, when unit testing a file that uses the facade, mock the facade. when testing the facade, if its a library do not mock the library. if its an api, intercept the requests and mock the responses.

- **Topic:** API Design

  - **Style:** RESTful APIs
  - **Preference Level:** Preferred
  - **Notes:** Adhere to standard HTTP methods, clear resource naming, and consistent error handling. Consider OpenAPI for documentation.
  - Handlers should only deal with request and response concerns and pass off to a controller for business logic.

- **Topic:** Infrastructure as Code (IaC)
  - **Tool:** Terraform
  - **Preference Level:** Strongly Preferred
  - **Rationale:** Cloud-agnostic, declarative syntax, strong community.

---

_(Add your own preferences below this line. You can copy and modify the structure of the examples above or create your own format.)_

## Your Preferences:

_(Start adding your preferences here...)_
