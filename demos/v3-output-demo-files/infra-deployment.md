# Infrastructure and Deployment Overview

  * **Cloud Provider:** AWS.
  * **Core Services Used:** Lambda, API Gateway (HTTP API), S3, DynamoDB (On-Demand), Step Functions, EventBridge Scheduler, CloudFront, CloudWatch, IAM, ACM (if custom domain).
  * **IaC:** AWS CDK (TypeScript), with separate CDK apps in backend and frontend polyrepos.
  * **Deployment Strategy (MVP):** CI (GitHub Actions) for build/test/lint. CDK deployment (initially manual or CI-scripted) to a single AWS environment.
  * **Environments (MVP):** Local Development; Single Deployed MVP Environment (e.g., "dev" acting as initial production).
  * **Rollback Strategy (MVP):** CDK stack rollback, Lambda/S3 versioning, DynamoDB PITR. 