# Infrastructure Change Validation Checklist

This checklist serves as a comprehensive framework for validating infrastructure changes before deployment to production. The DevOps/Platform Engineer should systematically work through each item, ensuring the infrastructure is secure, compliant, resilient, and properly implemented according to organizational standards.

[[LLM: INITIALIZATION INSTRUCTIONS - INFRASTRUCTURE VALIDATION

Before proceeding with this checklist, ensure you have access to:

1. platform-architecture.md or infrastructure-architecture.md (check docs/platform-architecture.md)
2. Infrastructure as Code files (Terraform, CloudFormation, Bicep, etc.)
3. CI/CD pipeline configurations
4. Security and compliance requirements
5. Network diagrams and configurations
6. Monitoring and alerting specifications

IMPORTANT: Infrastructure failures can cause complete outages. This checklist must be thorough.

VALIDATION PRINCIPLES:

1. Security First - Every decision should consider security implications
2. Automation - Manual processes are error-prone and don't scale
3. Resilience - Assume everything will fail and plan accordingly
4. Compliance - Regulatory requirements are non-negotiable
5. Cost Awareness - Over-provisioning wastes money, under-provisioning causes outages

EXECUTION MODE:
Ask the user if they want to work through the checklist:

- Section by section (interactive mode) - Deep dive into each area
- All at once (comprehensive mode) - Complete analysis with summary report

REMEMBER: Production infrastructure supports real users and business operations. Mistakes here have immediate, visible impact.]]

## 1. SECURITY & COMPLIANCE

[[LLM: Security breaches destroy trust and businesses. For each item:

1. Verify implementation, not just documentation
2. Check for common vulnerabilities (default passwords, open ports, etc.)
3. Ensure compliance requirements are actually met, not just considered
4. Look for defense in depth - multiple layers of security
5. Consider the blast radius if this security control fails]]

### 1.1 Access Management

- [ ] RBAC principles applied with least privilege access
- [ ] Service accounts have minimal required permissions
- [ ] Secrets management solution properly implemented
- [ ] IAM policies and roles documented and reviewed
- [ ] Access audit mechanisms configured

### 1.2 Data Protection

- [ ] Data at rest encryption enabled for all applicable services
- [ ] Data in transit encryption (TLS 1.2+) enforced
- [ ] Sensitive data identified and protected appropriately
- [ ] Backup encryption configured where required
- [ ] Data access audit trails implemented where required

### 1.3 Network Security

- [ ] Network security groups configured with minimal required access
- [ ] Private endpoints used for PaaS services where available
- [ ] Public-facing services protected with WAF policies
- [ ] Network traffic flows documented and secured
- [ ] Network segmentation properly implemented

### 1.4 Compliance Requirements

- [ ] Regulatory compliance requirements verified and met
- [ ] Security scanning integrated into pipeline
- [ ] Compliance evidence collection automated where possible
- [ ] Privacy requirements addressed in infrastructure design
- [ ] Security monitoring and alerting enabled

## 2. INFRASTRUCTURE AS CODE

[[LLM: IaC prevents configuration drift and enables disaster recovery. Verify:

1. EVERYTHING is in code - no "just this once" manual changes
2. Code quality matches application code standards
3. State management won't cause conflicts or data loss
4. Changes can be rolled back safely
5. New team members can understand and modify the infrastructure]]

### 2.1 IaC Implementation

- [ ] All resources defined in IaC (Terraform/Bicep/ARM)
- [ ] IaC code follows organizational standards and best practices
- [ ] No manual configuration changes permitted
- [ ] Dependencies explicitly defined and documented
- [ ] Modules and resource naming follow conventions

### 2.2 IaC Quality & Management

- [ ] IaC code reviewed by at least one other engineer
- [ ] State files securely stored and backed up
- [ ] Version control best practices followed
- [ ] IaC changes tested in non-production environment
- [ ] Documentation for IaC updated

### 2.3 Resource Organization

- [ ] Resources organized in appropriate resource groups
- [ ] Tags applied consistently per tagging strategy
- [ ] Resource locks applied where appropriate
- [ ] Naming conventions followed consistently
- [ ] Resource dependencies explicitly managed

## 3. RESILIENCE & AVAILABILITY

[[LLM: Downtime costs money and reputation. Check:

1. What happens when each component fails?
2. Are we meeting our SLA commitments?
3. Has resilience been tested, not just designed?
4. Can the system handle expected peak load?
5. Are failure modes graceful or catastrophic?]]

### 3.1 High Availability

- [ ] Resources deployed across appropriate availability zones
- [ ] SLAs for each component documented and verified
- [ ] Load balancing configured properly
- [ ] Failover mechanisms tested and verified
- [ ] Single points of failure identified and mitigated

### 3.2 Fault Tolerance

- [ ] Auto-scaling configured where appropriate
- [ ] Health checks implemented for all services
- [ ] Circuit breakers implemented where necessary
- [ ] Retry policies configured for transient failures
- [ ] Graceful degradation mechanisms implemented

### 3.3 Recovery Metrics & Testing

- [ ] Recovery time objectives (RTOs) verified
- [ ] Recovery point objectives (RPOs) verified
- [ ] Resilience testing completed and documented
- [ ] Chaos engineering principles applied where appropriate
- [ ] Recovery procedures documented and tested

## 4. BACKUP & DISASTER RECOVERY

[[LLM: Backups are worthless if they don't restore. Validate:

1. Have restores been tested recently?
2. Do backup windows meet business needs?
3. Are backups stored in a different failure domain?
4. Can we meet our RTO/RPO commitments?
5. Who has tested the disaster recovery runbook?]]

### 4.1 Backup Strategy

- [ ] Backup strategy defined and implemented
- [ ] Backup retention periods aligned with requirements
- [ ] Backup recovery tested and validated
- [ ] Point-in-time recovery configured where needed
- [ ] Backup access controls implemented

### 4.2 Disaster Recovery

- [ ] DR plan documented and accessible
- [ ] DR runbooks created and tested
- [ ] Cross-region recovery strategy implemented (if required)
- [ ] Regular DR drills scheduled
- [ ] Dependencies considered in DR planning

### 4.3 Recovery Procedures

- [ ] System state recovery procedures documented
- [ ] Data recovery procedures documented
- [ ] Application recovery procedures aligned with infrastructure
- [ ] Recovery roles and responsibilities defined
- [ ] Communication plan for recovery scenarios established

## 5. MONITORING & OBSERVABILITY

[[LLM: You can't fix what you can't see. Ensure:

1. Every critical metric has monitoring
2. Alerts fire BEFORE users complain
3. Logs are searchable and retained appropriately
4. Dashboards show what actually matters
5. Someone knows how to interpret the data]]

### 5.1 Monitoring Implementation

- [ ] Monitoring coverage for all critical components
- [ ] Appropriate metrics collected and dashboarded
- [ ] Log aggregation implemented
- [ ] Distributed tracing implemented (if applicable)
- [ ] User experience/synthetics monitoring configured

### 5.2 Alerting & Response

- [ ] Alerts configured for critical thresholds
- [ ] Alert routing and escalation paths defined
- [ ] Service health integration configured
- [ ] On-call procedures documented
- [ ] Incident response playbooks created

### 5.3 Operational Visibility

- [ ] Custom queries/dashboards created for key scenarios
- [ ] Resource utilization tracking configured
- [ ] Cost monitoring implemented
- [ ] Performance baselines established
- [ ] Operational runbooks available for common issues

## 6. PERFORMANCE & OPTIMIZATION

[[LLM: Performance impacts user experience and costs. Check:

1. Has performance been tested under realistic load?
2. Are we over-provisioned (wasting money)?
3. Are we under-provisioned (risking outages)?
4. Do we know our breaking point?
5. Is autoscaling configured correctly?]]

### 6.1 Performance Testing

- [ ] Performance testing completed and baseline established
- [ ] Resource sizing appropriate for workload
- [ ] Performance bottlenecks identified and addressed
- [ ] Latency requirements verified
- [ ] Throughput requirements verified

### 6.2 Resource Optimization

- [ ] Cost optimization opportunities identified
- [ ] Auto-scaling rules validated
- [ ] Resource reservation used where appropriate
- [ ] Storage tier selection optimized
- [ ] Idle/unused resources identified for cleanup

### 6.3 Efficiency Mechanisms

- [ ] Caching strategy implemented where appropriate
- [ ] CDN/edge caching configured for content
- [ ] Network latency optimized
- [ ] Database performance tuned
- [ ] Compute resource efficiency validated

## 7. OPERATIONS & GOVERNANCE

[[LLM: Good operations prevent 3am emergencies. Verify:

1. Can a new team member understand the system?
2. Are runbooks tested and current?
3. Do we know who owns what?
4. Are costs tracked and controlled?
5. Will auditors be satisfied?]]

### 7.1 Documentation

- [ ] Change documentation updated
- [ ] Runbooks created or updated
- [ ] Architecture diagrams updated
- [ ] Configuration values documented
- [ ] Service dependencies mapped and documented

### 7.2 Governance Controls

- [ ] Cost controls implemented
- [ ] Resource quota limits configured
- [ ] Policy compliance verified
- [ ] Audit logging enabled
- [ ] Management access reviewed

### 7.3 Knowledge Transfer

- [ ] Cross-team impacts documented and communicated
- [ ] Required training/knowledge transfer completed
- [ ] Architectural decision records updated
- [ ] Post-implementation review scheduled
- [ ] Operations team handover completed

## 8. CI/CD & DEPLOYMENT

[[LLM: Deployment failures impact everyone. Ensure:

1. Can we deploy without downtime?
2. Can we rollback quickly if needed?
3. Are deployments repeatable and reliable?
4. Do we test infrastructure changes?
5. Is the pipeline itself secure?]]

### 8.1 Pipeline Configuration

- [ ] CI/CD pipelines configured and tested
- [ ] Environment promotion strategy defined
- [ ] Deployment notifications configured
- [ ] Pipeline security scanning enabled
- [ ] Artifact management properly configured

### 8.2 Deployment Strategy

- [ ] Rollback procedures documented and tested
- [ ] Zero-downtime deployment strategy implemented
- [ ] Deployment windows identified and scheduled
- [ ] Progressive deployment approach used (if applicable)
- [ ] Feature flags implemented where appropriate

### 8.3 Verification & Validation

- [ ] Post-deployment verification tests defined
- [ ] Smoke tests automated
- [ ] Configuration validation automated
- [ ] Integration tests with dependent systems
- [ ] Canary/blue-green deployment configured (if applicable)

## 9. NETWORKING & CONNECTIVITY

[[LLM: Network issues are hard to debug. Validate:

1. Is network segmentation appropriate?
2. Are we exposing more than necessary?
3. Can traffic flow where it needs to?
4. Are we protected from common attacks?
5. Do we have visibility into network issues?]]

### 9.1 Network Design

- [ ] VNet/subnet design follows least-privilege principles
- [ ] Network security groups rules audited
- [ ] Public IP addresses minimized and justified
- [ ] DNS configuration verified
- [ ] Network diagram updated and accurate

### 9.2 Connectivity

- [ ] VNet peering configured correctly
- [ ] Service endpoints configured where needed
- [ ] Private link/private endpoints implemented
- [ ] External connectivity requirements verified
- [ ] Load balancer configuration verified

### 9.3 Traffic Management

- [ ] Inbound/outbound traffic flows documented
- [ ] Firewall rules reviewed and minimized
- [ ] Traffic routing optimized
- [ ] Network monitoring configured
- [ ] DDoS protection implemented where needed

## 10. COMPLIANCE & DOCUMENTATION

[[LLM: Compliance failures can shut down operations. Ensure:

1. Are we meeting all regulatory requirements?
2. Can we prove compliance to auditors?
3. Is our documentation actually useful?
4. Do teams know about these changes?
5. Will future engineers understand our decisions?]]

### 10.1 Compliance Verification

- [ ] Required compliance evidence collected
- [ ] Non-functional requirements verified
- [ ] License compliance verified
- [ ] Third-party dependencies documented
- [ ] Security posture reviewed

### 10.2 Documentation Completeness

- [ ] All documentation updated
- [ ] Architecture diagrams updated
- [ ] Technical debt documented (if any accepted)
- [ ] Cost estimates updated and approved
- [ ] Capacity planning documented

### 10.3 Cross-Team Collaboration

- [ ] Development team impact assessed and communicated
- [ ] Operations team handover completed
- [ ] Security team reviews completed
- [ ] Business stakeholders informed of changes
- [ ] Feedback loops established for continuous improvement

## 11. BMAD WORKFLOW INTEGRATION

[[LLM: Infrastructure must support the BMAD development workflow. Check:

1. Can all dev agents work with this infrastructure?
2. Does it align with architecture decisions?
3. Are product requirements actually met?
4. Can developers be productive?
5. Are we creating or removing blockers?]]

### 11.1 Development Agent Alignment

- [ ] Infrastructure changes support Frontend Dev (Mira) and Fullstack Dev (Enrique) requirements
- [ ] Backend requirements from Backend Dev (Lily) and Fullstack Dev (Enrique) accommodated
- [ ] Local development environment compatibility verified for all dev agents
- [ ] Infrastructure changes support automated testing frameworks
- [ ] Development agent feedback incorporated into infrastructure design

### 11.2 Product Alignment

- [ ] Infrastructure changes mapped to PRD requirements maintained by Product Owner
- [ ] Non-functional requirements from PRD verified in implementation
- [ ] Infrastructure capabilities and limitations communicated to Product teams
- [ ] Infrastructure release timeline aligned with product roadmap
- [ ] Technical constraints documented and shared with Product Owner

### 11.3 Architecture Alignment

- [ ] Infrastructure implementation validated against architecture documentation
- [ ] Architecture Decision Records (ADRs) reflected in infrastructure
- [ ] Technical debt identified by Architect addressed or documented
- [ ] Infrastructure changes support documented design patterns
- [ ] Performance requirements from architecture verified in implementation

## 12. ARCHITECTURE DOCUMENTATION VALIDATION

[[LLM: Good architecture docs prevent repeated mistakes. Verify:

1. Is the documentation complete and current?
2. Can someone new understand the system?
3. Are decisions explained with rationale?
4. Do diagrams match reality?
5. Is evolution possible without major rewrites?]]

### 12.1 Completeness Assessment

- [ ] All required sections of architecture template completed
- [ ] Architecture decisions documented with clear rationales
- [ ] Technical diagrams included for all major components
- [ ] Integration points with application architecture defined
- [ ] Non-functional requirements addressed with specific solutions

### 12.2 Consistency Verification

- [ ] Architecture aligns with broader system architecture
- [ ] Terminology used consistently throughout documentation
- [ ] Component relationships clearly defined
- [ ] Environment differences explicitly documented
- [ ] No contradictions between different sections

### 12.3 Stakeholder Usability

- [ ] Documentation accessible to both technical and non-technical stakeholders
- [ ] Complex concepts explained with appropriate analogies or examples
- [ ] Implementation guidance clear for development teams
- [ ] Operations considerations explicitly addressed
- [ ] Future evolution pathways documented

## 13. CONTAINER PLATFORM VALIDATION

[[LLM: Container platforms are complex with many failure modes. Ensure:

1. Is the cluster secure by default?
2. Can it handle expected workload?
3. Are workloads isolated appropriately?
4. Do we have visibility into container health?
5. Can we recover from node failures?]]

### 13.1 Cluster Configuration & Security

- [ ] Container orchestration platform properly installed and configured
- [ ] Cluster nodes configured with appropriate resource allocation and security policies
- [ ] Control plane high availability and security hardening implemented
- [ ] API server access controls and authentication mechanisms configured
- [ ] Cluster networking properly configured with security policies

### 13.2 RBAC & Access Control

- [ ] Role-Based Access Control (RBAC) implemented with least privilege principles
- [ ] Service accounts configured with minimal required permissions
- [ ] Pod security policies and security contexts properly configured
- [ ] Network policies implemented for micro-segmentation
- [ ] Secrets management integration configured and validated

### 13.3 Workload Management & Resource Control

- [ ] Resource quotas and limits configured per namespace/tenant requirements
- [ ] Horizontal and vertical pod autoscaling configured and tested
- [ ] Cluster autoscaling configured for node management
- [ ] Workload scheduling policies and node affinity rules implemented
- [ ] Container image security scanning and policy enforcement configured

### 13.4 Container Platform Operations

- [ ] Container platform monitoring and observability configured
- [ ] Container workload logging aggregation implemented
- [ ] Platform health checks and performance monitoring operational
- [ ] Backup and disaster recovery procedures for cluster state configured
- [ ] Operational runbooks and troubleshooting guides created

## 14. GITOPS WORKFLOWS VALIDATION

[[LLM: GitOps enables reliable deployments. Validate:

1. Is everything truly declarative?
2. Can we audit all changes?
3. Are environments properly isolated?
4. Can we rollback quickly?
5. Is drift detected and corrected?]]

### 14.1 GitOps Operator & Configuration

- [ ] GitOps operators properly installed and configured
- [ ] Application and configuration sync controllers operational
- [ ] Multi-cluster management configured (if required)
- [ ] Sync policies, retry mechanisms, and conflict resolution configured
- [ ] Automated pruning and drift detection operational

### 14.2 Repository Structure & Management

- [ ] Repository structure follows GitOps best practices
- [ ] Configuration templating and parameterization properly implemented
- [ ] Environment-specific configuration overlays configured
- [ ] Configuration validation and policy enforcement implemented
- [ ] Version control and branching strategies properly defined

### 14.3 Environment Promotion & Automation

- [ ] Environment promotion pipelines operational (dev → staging → prod)
- [ ] Automated testing and validation gates configured
- [ ] Approval workflows and change management integration implemented
- [ ] Automated rollback mechanisms configured and tested
- [ ] Promotion notifications and audit trails operational

### 14.4 GitOps Security & Compliance

- [ ] GitOps security best practices and access controls implemented
- [ ] Policy enforcement for configurations and deployments operational
- [ ] Secret management integration with GitOps workflows configured
- [ ] Security scanning for configuration changes implemented
- [ ] Audit logging and compliance monitoring configured

## 15. SERVICE MESH VALIDATION

[[LLM: Service meshes add complexity but enable advanced patterns. Check:

1. Is the overhead justified by benefits?
2. Is service communication secure?
3. Can we debug service issues?
4. Are failure modes handled gracefully?
5. Do developers understand the mesh?]]

### 15.1 Service Mesh Architecture & Installation

- [ ] Service mesh control plane properly installed and configured
- [ ] Data plane (sidecars/proxies) deployed and configured correctly
- [ ] Service mesh components integrated with container platform
- [ ] Service mesh networking and connectivity validated
- [ ] Resource allocation and performance tuning for mesh components optimal

### 15.2 Traffic Management & Communication

- [ ] Traffic routing rules and policies configured and tested
- [ ] Load balancing strategies and failover mechanisms operational
- [ ] Traffic splitting for canary deployments and A/B testing configured
- [ ] Circuit breakers and retry policies implemented and validated
- [ ] Timeout and rate limiting policies configured

### 15.3 Service Mesh Security

- [ ] Mutual TLS (mTLS) implemented for service-to-service communication
- [ ] Service-to-service authorization policies configured
- [ ] Identity and access management integration operational
- [ ] Network security policies and micro-segmentation implemented
- [ ] Security audit logging for service mesh events configured

### 15.4 Service Discovery & Observability

- [ ] Service discovery mechanisms and service registry integration operational
- [ ] Advanced load balancing algorithms and health checking configured
- [ ] Service mesh observability (metrics, logs, traces) implemented
- [ ] Distributed tracing for service communication operational
- [ ] Service dependency mapping and topology visualization available

## 16. DEVELOPER EXPERIENCE PLATFORM VALIDATION

[[LLM: Developer productivity depends on platform usability. Ensure:

1. Can developers self-serve effectively?
2. Are golden paths actually helpful?
3. Is onboarding smooth and quick?
4. Do developers have the tools they need?
5. Are we measuring developer satisfaction?]]

### 16.1 Self-Service Infrastructure

- [ ] Self-service provisioning for development environments operational
- [ ] Automated resource provisioning and management configured
- [ ] Namespace/project provisioning with proper resource limits implemented
- [ ] Self-service database and storage provisioning available
- [ ] Automated cleanup and resource lifecycle management operational

### 16.2 Developer Tooling & Templates

- [ ] Golden path templates for common application patterns available and tested
- [ ] Project scaffolding and boilerplate generation operational
- [ ] Template versioning and update mechanisms configured
- [ ] Template customization and parameterization working correctly
- [ ] Template compliance and security scanning implemented

### 16.3 Platform APIs & Integration

- [ ] Platform APIs for infrastructure interaction operational and documented
- [ ] API authentication and authorization properly configured
- [ ] API documentation and developer resources available and current
- [ ] Workflow automation and integration capabilities tested
- [ ] API rate limiting and usage monitoring configured

### 16.4 Developer Experience & Documentation

- [ ] Comprehensive developer onboarding documentation available
- [ ] Interactive tutorials and getting-started guides functional
- [ ] Developer environment setup automation operational
- [ ] Access provisioning and permissions management streamlined
- [ ] Troubleshooting guides and FAQ resources current and accessible

### 16.5 Productivity & Analytics

- [ ] Development tool integrations (IDEs, CLI tools) operational
- [ ] Developer productivity dashboards and metrics implemented
- [ ] Development workflow optimization tools available
- [ ] Platform usage monitoring and analytics configured
- [ ] User feedback collection and analysis mechanisms operational

---

## FINAL INFRASTRUCTURE VALIDATION

[[LLM: COMPREHENSIVE INFRASTRUCTURE REPORT GENERATION

Generate a detailed infrastructure validation report:

1. Executive Summary

   - Overall readiness for production (GO/NO-GO)
   - Critical risks identified
   - Security posture assessment
   - Compliance status
   - Estimated reliability (9s of uptime)

2. Risk Analysis by Category

   - CRITICAL: Production blockers
   - HIGH: Should fix before production
   - MEDIUM: Fix within 30 days
   - LOW: Consider for future improvements

3. Technical Debt Assessment

   - Shortcuts taken and their impact
   - Future scaling concerns
   - Maintenance burden created
   - Cost implications

4. Operational Readiness

   - Can the ops team support this?
   - Are runbooks complete?
   - Is monitoring sufficient?
   - Can we meet SLAs?

5. Security & Compliance Summary

   - Security controls effectiveness
   - Compliance gaps
   - Attack surface analysis
   - Data protection status

6. Platform-Specific Findings

   - Container platform readiness
   - GitOps maturity
   - Service mesh complexity
   - Developer experience gaps

7. Recommendations
   - Must-fix before production
   - Should-fix for stability
   - Consider for optimization
   - Future roadmap items

After presenting the report, ask if the user wants:

- Deep dive into any failed sections
- Risk mitigation strategies
- Implementation prioritization help
- Specific remediation guidance]]

### Prerequisites Verified

- [ ] All checklist sections reviewed (1-16)
- [ ] No outstanding critical or high-severity issues
- [ ] All infrastructure changes tested in non-production environment
- [ ] Rollback plan documented and tested
- [ ] Required approvals obtained
- [ ] Infrastructure changes verified against architectural decisions documented by Architect agent
- [ ] Development environment impacts identified and mitigated
- [ ] Infrastructure changes mapped to relevant user stories and epics
- [ ] Release coordination planned with development teams
- [ ] Local development environment compatibility verified
- [ ] Platform component integration validated
- [ ] Cross-platform functionality tested and verified
