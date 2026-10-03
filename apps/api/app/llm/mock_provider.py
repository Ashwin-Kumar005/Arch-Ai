"""
Deterministic Mock LLM Provider for Demo Mode and Testing
"""

import time
import json
import hashlib
import random
from typing import Dict, Any, Type, Optional
from pydantic import BaseModel
from app.llm.base import LLMProvider, LLMResponse


class MockProvider(LLMProvider):
    def __init__(self, model_name: str = "mock-architecture-engine-v1"):
        self.model_name = model_name

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2
    ) -> LLMResponse:
        start_time = time.time()
        # Simulate realistic fast inference delay
        time.sleep(0.05)
        duration_ms = int((time.time() - start_time) * 1000)

        schema_name = response_schema.__name__ if response_schema else ""
        parsed_json = self._generate_mock_payload(schema_name, user_prompt)

        return LLMResponse(
            raw_content=json.dumps(parsed_json, indent=2),
            parsed_json=parsed_json,
            prompt_tokens=420,
            completion_tokens=850,
            total_tokens=1270,
            duration_ms=duration_ms,
            model_name=self.model_name
        )

    async def get_embedding(self, text: str) -> list[float]:
        seed = int(hashlib.md5(text.encode()).hexdigest(), 16)
        rng = random.Random(seed)
        return [rng.uniform(-1, 1) for _ in range(768)]

    def _generate_mock_payload(self, schema_name: str, prompt: str) -> Dict[str, Any]:
        if "RequirementAnalysis" in schema_name:
            return {
                "project_summary": "An on-demand, multi-tenant digital marketplace connecting local service providers with homeowners for instant quote comparison, verified booking, secure escrow payments, and job tracking.",
                "business_goals": [
                    "Reduce service provider discovery and quote turnaround time from days to under 5 minutes.",
                    "Ensure transaction security and trust through milestone escrow payments and verified customer reviews.",
                    "Capture a 10% platform transaction fee on completed home service jobs."
                ],
                "actors": [
                    "Homeowner (Consumer seeking reliable home repair and renovation services)",
                    "Service Provider / Contractor (Verified professionals managing bookings, invoices, and job dispatch)",
                    "Platform Administrator (Moderates disputes, audits KYC verification, oversees platform compliance)",
                    "Payment Gateway / Escrow Service (Stripe Connect for automated split payouts and escrow holds)"
                ],
                "functional_requirements": [
                    "User authentication with email OTP, social logins, and Contractor KYC identity verification.",
                    "Geospatial search and filtering for local service providers by trade, rating, distance, and availability.",
                    "Real-time appointment scheduling, calendar synchronization, and interactive in-app quotes.",
                    "Milestone-based payment processing with automated escrow hold until homeowner sign-off.",
                    "Real-time bidirectional messaging, photo sharing, and dispatch location tracking.",
                    "Post-job review, star rating, and dispute escalation management workflow."
                ],
                "non_functional_requirements": [
                    "P95 API response latency < 150ms under peak load.",
                    "System availability of 99.9% uptime SLA.",
                    "Full PCI-DSS compliance and GDPR/CCPA data privacy protection.",
                    "End-to-end data encryption in transit (TLS 1.3) and at rest (AES-256-GCM)."
                ],
                "constraints": [
                    "Must integrate with Stripe Connect for multi-party marketplace payments.",
                    "Mobile responsive web app required for launch, with PWA offline service capabilities.",
                    "Initial cloud budget capped at $500/month."
                ],
                "assumptions": [
                    "Homeowners and contractors have mobile devices with GPS capabilities.",
                    "Payment transactions occur in USD and local currencies via standard credit cards or ACH."
                ],
                "dependencies": [
                    "Stripe Connect API for payment processing and vendor onboarding.",
                    "Google Maps / Mapbox API for geocoding and proximity calculations.",
                    "Twilio / SendGrid for SMS and transactional notifications."
                ],
                "risks": [
                    "Marketplace disintermediation (users transacting offline after initial match).",
                    "Contractor quality variance causing chargebacks and dispute overhead.",
                    "Cold-start liquidity problem in new geographical metro markets."
                ],
                "open_questions": [
                    {
                        "id": "q1",
                        "question_text": "What payment processing and payout architecture should be deployed for provider disbursements?",
                        "category": "Payments & Escrow",
                        "options": ["Stripe Connect Custom (Platform managed KYC)", "Stripe Connect Express (Hosted onboarding)", "PayPal Commerce Platform", "Direct Bank ACH / Plaid"],
                        "priority": "HIGH"
                    },
                    {
                        "id": "q2",
                        "question_text": "What is the expected initial geographic rollout scale and concurrent user volume?",
                        "category": "Scalability",
                        "options": ["Single City Pilot (1k - 5k MAU)", "Multi-State Regional (20k - 50k MAU)", "National High-Growth (100k+ MAU)"],
                        "priority": "MEDIUM"
                    },
                    {
                        "id": "q3",
                        "question_text": "How should contractor background checks and licensing verification be enforced?",
                        "category": "Trust & Security",
                        "options": ["Automated Third-Party API (Checkr / Persona)", "Manual Admin Review in Portal", "Self-Attestation with Community Flagging"],
                        "priority": "HIGH"
                    }
                ]
            }

        elif "ProductRoadmap" in schema_name:
            return {
                "mvp_definition": "Core self-serve marketplace enabling homeowners to search verified local contractors, receive binding price quotes, schedule appointments, and pay securely via escrow.",
                "mvp_features": [
                    "User Registration & Role-Based Profiles (Homeowner, Contractor, Admin)",
                    "Contractor Profile & Service Catalog Management",
                    "Geospatial Search & Proximity Filtering",
                    "Quote Request & Direct Booking Engine",
                    "Stripe Connect Escrow Payment Flow",
                    "In-App Messaging & Notifications",
                    "Post-Service Rating & Review System"
                ],
                "post_mvp_features": [
                    "AI Automated Job Quoting & Computer Vision Damage Assessment",
                    "Contractor Route Optimization & Multi-crew Dispatching",
                    "Annual Home Maintenance Subscription Plans",
                    "Enterprise Property Management Sub-accounts"
                ],
                "user_stories": [
                    {
                        "id": "US-01",
                        "as_a": "Homeowner",
                        "i_want": "to search for licensed plumbers within a 15-mile radius and compare verified hourly rates",
                        "so_that": "I can make an informed decision and book an emergency repair quickly",
                        "acceptance_criteria": [
                            "Search results show contractor rating, distance, license badge, and starting rate.",
                            "Filter by availability today, tomorrow, or weekend.",
                            "Map view shows pin cluster with interactive previews."
                        ],
                        "priority": "MUST_HAVE"
                    },
                    {
                        "id": "US-02",
                        "as_a": "Contractor",
                        "i_want": "to receive instant push notifications for new job leads in my trade category",
                        "so_that": "I can submit competitive quotes and fill open calendar slots",
                        "acceptance_criteria": [
                            "Notification includes job description, approximate neighborhood, and target date.",
                            "One-tap quote response with template pricing.",
                            "Lead expires after 24 hours if unacknowledged."
                        ],
                        "priority": "MUST_HAVE"
                    },
                    {
                        "id": "US-03",
                        "as_a": "Homeowner",
                        "i_want": "my payment to be held in secure escrow until the job is completed and inspected",
                        "so_that": "I have guaranteed protection against incomplete or shoddy contractor work",
                        "acceptance_criteria": [
                            "Credit card authorized upon booking confirmation.",
                            "Funds captured into escrow upon job start.",
                            "Automatic disbursement 48h after homeowner completion sign-off."
                        ],
                        "priority": "MUST_HAVE"
                    }
                ],
                "sprint_plan": [
                    {
                        "sprint_number": 1,
                        "focus_area": "Foundation & Identity",
                        "duration_weeks": 2,
                        "deliverables": ["Database Schema & Migrations", "JWT Auth & RBAC Middleware", "User Profile Management APIs"]
                    },
                    {
                        "sprint_number": 2,
                        "focus_area": "Contractor Discovery & Booking",
                        "duration_weeks": 2,
                        "deliverables": ["Geospatial Search Service", "Contractor Service Catalog UI", "Appointment Scheduling Engine"]
                    },
                    {
                        "sprint_number": 3,
                        "focus_area": "Escrow Payments & Messaging",
                        "duration_weeks": 2,
                        "deliverables": ["Stripe Connect Integration", "Escrow Hold & Release Worker", "Real-Time WebSocket Chat"]
                    },
                    {
                        "sprint_number": 4,
                        "focus_area": "Admin, Reviews & Hardening",
                        "duration_weeks": 2,
                        "deliverables": ["Admin Dispute Dashboard", "Review System", "E2E Test Automation & Deployment"]
                    }
                ],
                "key_performance_indicators": [
                    "Time-to-first-quote < 15 minutes",
                    "Booking conversion rate > 18%",
                    "Dispute rate < 1.5% of total gross merchandise value"
                ]
            }

        elif "SolutionArchitecture" in schema_name:
            return {
                "system_overview": "A resilient Modular Monolith transitioning to Event-Driven Microservices, featuring Next.js frontend, FastAPI API gateway, PostgreSQL transactional storage, Redis caching/pub-sub, and background Celery task workers.",
                "topology_pattern": "Modular Monolith with Event-Driven Background Workers",
                "nodes": [
                    {"id": "client", "label": "Next.js Web & Mobile Client", "type": "frontend", "description": "React 18 App Router with Tailwind CSS and React Query", "x": 100, "y": 150},
                    {"id": "gateway", "label": "API Gateway / Nginx", "type": "gateway", "description": "SSL Termination, Rate Limiting, CORS & Reverse Proxy", "x": 350, "y": 150},
                    {"id": "backend", "label": "FastAPI Core Services", "type": "service", "description": "Auth, Booking, Quoting, Marketplace & Search Controllers", "x": 600, "y": 150},
                    {"id": "redis", "label": "Redis 7 Cache & Pub/Sub", "type": "cache", "description": "Session caching, rate limits & real-time chat broadcast", "x": 600, "y": 300},
                    {"id": "db", "label": "PostgreSQL 16 + PostGIS", "type": "database", "description": "ACID transactional store & spatial geospatial index", "x": 850, "y": 150},
                    {"id": "worker", "label": "Async Worker (Celery)", "type": "service", "description": "Payment escrow reconciliation & email notifications", "x": 850, "y": 300},
                    {"id": "stripe", "label": "Stripe Connect API", "type": "external", "description": "Payment gateway, KYC onboarding & escrow payouts", "x": 1100, "y": 150}
                ],
                "edges": [
                    {"id": "e1", "source": "client", "target": "gateway", "label": "HTTPS / WSS", "protocol": "HTTPS"},
                    {"id": "e2", "source": "gateway", "target": "backend", "label": "ASGI Reverse Proxy", "protocol": "HTTP"},
                    {"id": "e3", "source": "backend", "target": "redis", "label": "Cache & PubSub", "protocol": "TCP"},
                    {"id": "e4", "source": "backend", "target": "db", "label": "SQLAlchemy ORM", "protocol": "DB"},
                    {"id": "e5", "source": "backend", "target": "worker", "label": "Task Enqueue", "protocol": "TCP"},
                    {"id": "e6", "source": "worker", "target": "db", "label": "State Updates", "protocol": "DB"},
                    {"id": "e7", "source": "backend", "target": "stripe", "label": "Webhook / SDK", "protocol": "HTTPS"}
                ],
                "mermaid_diagram": "graph TD\n    Client[Next.js Client] -->|HTTPS/WSS| Gateway[API Gateway]\n    Gateway -->|Proxy| API[FastAPI Backend]\n    API -->|Read/Write| DB[(PostgreSQL 16)]\n    API -->|Cache/PubSub| Redis[(Redis 7)]\n    API -->|Tasks| Worker[Async Worker]\n    Worker -->|Reconcile| DB\n    API -->|Webhook/SDK| Stripe[Stripe Connect]",
                "scalability_strategy": "Stateless backend instances scaled horizontally behind load balancer; Read replicas for PostgreSQL reporting; Redis caching for hot contractor profiles and search results.",
                "caching_and_event_strategy": "Cache-aside pattern for contractor search listings with 5-minute TTL; Redis Streams for event broadcasting across WebSocket server instances.",
                "architecture_decisions": [
                    {
                        "adr_number": "ADR-001",
                        "title": "Adoption of FastAPI with Asyncpg",
                        "context": "Need high concurrent I/O performance for chat, real-time booking, and webhook ingestion.",
                        "decision": "Use Python FastAPI with SQLAlchemy 2.0 async engine.",
                        "consequences": "High throughput, automated OpenAPI generation, typed Pydantic validation.",
                        "status": "ACCEPTED"
                    },
                    {
                        "adr_number": "ADR-002",
                        "title": "PostgreSQL with PostGIS for Geospatial Querying",
                        "context": "Contractor search relies on radius and proximity filtering.",
                        "decision": "Leverage PostgreSQL 16 spatial indexing (ST_DWithin) rather than a separate geospatial engine.",
                        "consequences": "Simplified operational complexity and guaranteed ACID consistency.",
                        "status": "ACCEPTED"
                    }
                ]
            }

        elif "DatabaseArchitecture" in schema_name:
            return {
                "dialect": "PostgreSQL 16",
                "database_overview": "Normalized 3NF relational data model supporting multi-tenant user authentication, contractor catalogs, geospatial booking requests, milestone escrow payments, and immutable audit trails.",
                "tables": [
                    {
                        "name": "users",
                        "description": "Primary identity table for homeowners, contractors, and administrators.",
                        "columns": [
                            {"name": "id", "type": "UUID", "is_primary_key": True, "is_nullable": False, "is_unique": True, "description": "Primary Key"},
                            {"name": "email", "type": "VARCHAR(255)", "is_primary_key": False, "is_nullable": False, "is_unique": True, "description": "Unique email"},
                            {"name": "hashed_password", "type": "VARCHAR(255)", "is_primary_key": False, "is_nullable": False, "description": "Bcrypt password hash"},
                            {"name": "full_name", "type": "VARCHAR(255)", "is_primary_key": False, "is_nullable": False, "description": "Full display name"},
                            {"name": "role", "type": "VARCHAR(50)", "is_primary_key": False, "is_nullable": False, "default_value": "'homeowner'", "description": "User role: homeowner, contractor, admin"},
                            {"name": "created_at", "type": "TIMESTAMP WITH TIME ZONE", "is_primary_key": False, "is_nullable": False, "default_value": "NOW()"}
                        ],
                        "indexes": ["CREATE INDEX idx_users_email ON users(email);", "CREATE INDEX idx_users_role ON users(role);"]
                    },
                    {
                        "name": "contractor_profiles",
                        "description": "Extended verified contractor profile, licenses, and business metadata.",
                        "columns": [
                            {"name": "id", "type": "UUID", "is_primary_key": True, "is_nullable": False, "is_unique": True},
                            {"name": "user_id", "type": "UUID", "is_primary_key": False, "is_nullable": False, "is_unique": True, "description": "FK to users.id"},
                            {"name": "business_name", "type": "VARCHAR(255)", "is_primary_key": False, "is_nullable": False},
                            {"name": "trade_category", "type": "VARCHAR(100)", "is_primary_key": False, "is_nullable": False},
                            {"name": "hourly_rate", "type": "NUMERIC(10,2)", "is_primary_key": False, "is_nullable": False},
                            {"name": "latitude", "type": "FLOAT", "is_primary_key": False, "is_nullable": True},
                            {"name": "longitude", "type": "FLOAT", "is_primary_key": False, "is_nullable": True},
                            {"name": "is_verified", "type": "BOOLEAN", "is_primary_key": False, "is_nullable": False, "default_value": "FALSE"},
                            {"name": "stripe_account_id", "type": "VARCHAR(255)", "is_primary_key": False, "is_nullable": True}
                        ],
                        "indexes": ["CREATE INDEX idx_contractor_trade ON contractor_profiles(trade_category);", "CREATE INDEX idx_contractor_geo ON contractor_profiles(latitude, longitude);"]
                    },
                    {
                        "name": "bookings",
                        "description": "Job bookings, appointment scheduling, and lifecycle status.",
                        "columns": [
                            {"name": "id", "type": "UUID", "is_primary_key": True, "is_nullable": False, "is_unique": True},
                            {"name": "homeowner_id", "type": "UUID", "is_primary_key": False, "is_nullable": False},
                            {"name": "contractor_id", "type": "UUID", "is_primary_key": False, "is_nullable": False},
                            {"name": "service_title", "type": "VARCHAR(255)", "is_primary_key": False, "is_nullable": False},
                            {"name": "agreed_price", "type": "NUMERIC(10,2)", "is_primary_key": False, "is_nullable": False},
                            {"name": "status", "type": "VARCHAR(50)", "is_primary_key": False, "is_nullable": False, "default_value": "'PENDING'"},
                            {"name": "scheduled_date", "type": "TIMESTAMP WITH TIME ZONE", "is_primary_key": False, "is_nullable": False},
                            {"name": "created_at", "type": "TIMESTAMP WITH TIME ZONE", "is_primary_key": False, "is_nullable": False, "default_value": "NOW()"}
                        ],
                        "indexes": ["CREATE INDEX idx_bookings_homeowner ON bookings(homeowner_id);", "CREATE INDEX idx_bookings_contractor ON bookings(contractor_id);"]
                    },
                    {
                        "name": "payments",
                        "description": "Escrow payment transactions and payout records.",
                        "columns": [
                            {"name": "id", "type": "UUID", "is_primary_key": True, "is_nullable": False, "is_unique": True},
                            {"name": "booking_id", "type": "UUID", "is_primary_key": False, "is_nullable": False},
                            {"name": "amount", "type": "NUMERIC(10,2)", "is_primary_key": False, "is_nullable": False},
                            {"name": "platform_fee", "type": "NUMERIC(10,2)", "is_primary_key": False, "is_nullable": False},
                            {"name": "escrow_status", "type": "VARCHAR(50)", "is_primary_key": False, "is_nullable": False, "default_value": "'HELD'"},
                            {"name": "stripe_payment_intent_id", "type": "VARCHAR(255)", "is_primary_key": False, "is_nullable": True}
                        ],
                        "indexes": ["CREATE INDEX idx_payments_booking ON payments(booking_id);"]
                    }
                ],
                "relations": [
                    {"from_table": "contractor_profiles", "from_column": "user_id", "to_table": "users", "to_column": "id", "relation_type": "1:1", "cascade_delete": True},
                    {"from_table": "bookings", "from_column": "homeowner_id", "to_table": "users", "to_column": "id", "relation_type": "1:N", "cascade_delete": False},
                    {"from_table": "bookings", "from_column": "contractor_id", "to_table": "users", "to_column": "id", "relation_type": "1:N", "cascade_delete": False},
                    {"from_table": "payments", "from_column": "booking_id", "to_table": "bookings", "to_column": "id", "relation_type": "1:1", "cascade_delete": True}
                ],
                "indexing_strategy": "Composite B-tree indexes for foreign keys; composite latitude/longitude spatial indexing; GIN index for full-text search on service descriptions.",
                "ddl_script": """-- PostgreSQL 16 DDL Script for ArchAI Local Services Marketplace
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'homeowner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE contractor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    trade_category VARCHAR(100) NOT NULL,
    hourly_rate NUMERIC(10,2) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    stripe_account_id VARCHAR(255)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homeowner_id UUID NOT NULL REFERENCES users(id),
    contractor_id UUID NOT NULL REFERENCES users(id),
    service_title VARCHAR(255) NOT NULL,
    agreed_price NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    platform_fee NUMERIC(10,2) NOT NULL,
    escrow_status VARCHAR(50) NOT NULL DEFAULT 'HELD',
    stripe_payment_intent_id VARCHAR(255)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_contractor_trade ON contractor_profiles(trade_category);
CREATE INDEX idx_bookings_homeowner ON bookings(homeowner_id);
CREATE INDEX idx_bookings_contractor ON bookings(contractor_id);
"""
            }

        elif "BackendArchitecture" in schema_name:
            return {
                "framework": "FastAPI (Python 3.12+)",
                "api_title": "Marketplace Core REST API",
                "version": "1.0.0",
                "endpoints": [
                    {
                        "path": "/api/v1/auth/register",
                        "method": "POST",
                        "summary": "Register a new homeowner or contractor account",
                        "tags": ["Authentication"],
                        "parameters": [],
                        "responses": {"201": "User created with JWT auth token", "400": "Email already exists"},
                        "auth_required": False
                    },
                    {
                        "path": "/api/v1/auth/login",
                        "method": "POST",
                        "summary": "Authenticate with email and password",
                        "tags": ["Authentication"],
                        "parameters": [],
                        "responses": {"200": "Bearer JWT token with user profile", "401": "Invalid credentials"},
                        "auth_required": False
                    },
                    {
                        "path": "/api/v1/contractors/search",
                        "method": "GET",
                        "summary": "Geospatial search for local service providers",
                        "tags": ["Contractors"],
                        "parameters": [
                            {"name": "trade", "location": "query", "type": "string", "required": True, "description": "Trade category (e.g. plumbing, electrical)"},
                            {"name": "lat", "location": "query", "type": "number", "required": True, "description": "Latitude coordinate"},
                            {"name": "lng", "location": "query", "type": "number", "required": True, "description": "Longitude coordinate"},
                            {"name": "radius_miles", "location": "query", "type": "number", "required": False, "description": "Search radius in miles"}
                        ],
                        "responses": {"200": "Paginated list of verified contractor cards"},
                        "auth_required": False
                    },
                    {
                        "path": "/api/v1/bookings",
                        "method": "POST",
                        "summary": "Create a new service appointment booking",
                        "tags": ["Bookings"],
                        "parameters": [],
                        "responses": {"201": "Booking created in PENDING state", "422": "Validation error"},
                        "auth_required": True,
                        "required_role": "homeowner"
                    },
                    {
                        "path": "/api/v1/payments/escrow/authorize",
                        "method": "POST",
                        "summary": "Authorize payment and place funds into Stripe Escrow",
                        "tags": ["Payments"],
                        "parameters": [],
                        "responses": {"200": "Payment authorized and escrow hold created"},
                        "auth_required": True,
                        "required_role": "homeowner"
                    },
                    {
                        "path": "/api/v1/payments/escrow/release",
                        "method": "POST",
                        "summary": "Release escrow funds to contractor upon job completion",
                        "tags": ["Payments"],
                        "parameters": [],
                        "responses": {"200": "Escrow released and contractor payout initiated"},
                        "auth_required": True,
                        "required_role": "homeowner"
                    }
                ],
                "service_layer_structure": [
                    "app/services/auth_service.py (Identity, JWT hashing, token lifecycle)",
                    "app/services/contractor_service.py (Contractor profiles and catalog management)",
                    "app/services/search_service.py (Geospatial indexing and radius calculations)",
                    "app/services/booking_service.py (Appointment scheduling state machine)",
                    "app/services/escrow_service.py (Stripe Connect escrow orchestration & webhook handler)"
                ],
                "authentication_strategy": "Bearer JWT with 24-hour expiration, RSA256 signature verification, and RBAC permission decorators.",
                "openapi_spec": {
                    "openapi": "3.1.0",
                    "info": {"title": "Marketplace API", "version": "1.0.0"},
                    "paths": {
                        "/api/v1/contractors/search": {
                            "get": {"summary": "Search contractors", "responses": {"200": {"description": "Success"}}}
                        }
                    }
                }
            }

        elif "FrontendArchitecture" in schema_name:
            return {
                "framework": "Next.js 14+ (App Router) with React 18 & TypeScript",
                "state_management": "TanStack Query (React Query) for server state caching; Zustand for global user and cart state; URL query parameters for filter persistence.",
                "ui_library": "Tailwind CSS with custom Dark Theme Tokens and Radix UI primitives (shadcn/ui style)",
                "screens": [
                    {
                        "screen_id": "SCR-01",
                        "name": "Marketplace Landing & Hero Discovery",
                        "route_path": "/",
                        "description": "Hero section with instant trade search bar, category pills, trust badges, and testimonials.",
                        "components": ["HeroSearch", "CategoryGrid", "VerifiedContractorCarousel", "HowItWorksSection"],
                        "api_endpoints_used": ["/api/v1/contractors/categories", "/api/v1/stats/featured"]
                    },
                    {
                        "screen_id": "SCR-02",
                        "name": "Contractor Geospatial Search Results",
                        "route_path": "/search",
                        "description": "Split view containing interactive Map on the right and filterable contractor cards on the left.",
                        "components": ["FilterBar", "ContractorCardList", "MapboxGlViewer", "QuickQuoteModal"],
                        "api_endpoints_used": ["/api/v1/contractors/search"]
                    },
                    {
                        "screen_id": "SCR-03",
                        "name": "Contractor Profile & Booking Calendar",
                        "route_path": "/contractors/[id]",
                        "description": "Detailed contractor portfolio, verified badge status, customer reviews, and appointment booking widget.",
                        "components": ["ProfileHeader", "PhotoGallery", "ReviewsList", "InteractiveBookingCalendar"],
                        "api_endpoints_used": ["/api/v1/contractors/{id}", "/api/v1/contractors/{id}/availability"]
                    },
                    {
                        "screen_id": "SCR-04",
                        "name": "Escrow Checkout & Payment",
                        "route_path": "/checkout/[bookingId]",
                        "description": "Order summary, milestone payment breakdown, escrow guarantee badge, and Stripe Elements card form.",
                        "components": ["OrderSummary", "EscrowTrustBanner", "StripePaymentForm", "GuaranteeBadge"],
                        "api_endpoints_used": ["/api/v1/payments/escrow/authorize"]
                    },
                    {
                        "screen_id": "SCR-05",
                        "name": "Homeowner & Contractor Job Dashboard",
                        "route_path": "/dashboard",
                        "description": "Active bookings, job timeline, photo inspection review, escrow release button, and in-app chat drawer.",
                        "components": ["ActiveJobCard", "JobTimelineStepper", "EscrowReleaseButton", "ChatDrawer"],
                        "api_endpoints_used": ["/api/v1/bookings/my", "/api/v1/payments/escrow/release"]
                    }
                ],
                "component_hierarchy": [
                    {"name": "Navbar", "category": "layout", "description": "Global navigation, search, and user avatar dropdown", "props": ["user", "notificationsCount"]},
                    {"name": "ContractorCard", "category": "feature", "description": "Displays contractor photo, trade, rating, hourly rate, and direct quote trigger", "props": ["contractor", "onSelect"]},
                    {"name": "MapViewer", "category": "feature", "description": "Interactive map clustering contractor markers with radius circle overlay", "props": ["markers", "centerCoordinates", "onMarkerClick"]},
                    {"name": "EscrowReleaseButton", "category": "feature", "description": "Two-factor confirmation button that unlocks held funds to provider", "props": ["bookingId", "amount", "onSuccess"]}
                ],
                "responsive_design_rules": [
                    "Desktop (>=1024px): 2-column split view (Search results + Sticky Map).",
                    "Tablet (768px - 1023px): Collapsible filter drawer with toggleable Map view.",
                    "Mobile (<768px): Full-width stacked cards, bottom navigation bar, and slide-up booking modal."
                ]
            }

        elif "DevOpsArchitecture" in schema_name:
            return {
                "container_topology": [
                    "archai-web: Next.js Node.js 20 runtime (Port 3000)",
                    "archai-api: FastAPI Uvicorn ASGI server (Port 8000)",
                    "archai-worker: Python Celery async background worker",
                    "archai-db: PostgreSQL 16 with PostGIS / pgvector (Port 5432)",
                    "archai-redis: Redis 7.2 Alpine cache and broker (Port 6379)",
                    "archai-nginx: Reverse proxy with SSL termination and gzip (Port 80/443)"
                ],
                "docker_compose_yaml": """version: '3.8'

services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - api

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://archai:archai_secure_pass@db:5432/archai
      - REDIS_URL=redis://redis:6379/0
      - DEMO_MODE=false
    depends_on:
      - db
      - redis

  worker:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    command: python -m app.workers.orchestrator_worker
    environment:
      - DATABASE_URL=postgresql://archai:archai_secure_pass@db:5432/archai
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=archai
      - POSTGRES_PASSWORD=archai_secure_pass
      - POSTGRES_DB=archai
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
""",
                "github_actions_ci_yaml": """name: ArchAI CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: apps/web/package.json

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'
          cache-dependency-path: apps/api/requirements.txt

      - name: Install Frontend Dependencies
        run: cd apps/web && npm ci

      - name: Install Backend Dependencies
        run: cd apps/api && pip install -r requirements.txt

      - name: Backend Pytest Suite
        run: cd apps/api && pytest tests/ -v

      - name: Frontend Vitest Suite
        run: cd apps/web && npm test -- --run

      - name: Build Web Application
        run: cd apps/web && npm run build
""",
                "environment_variables_spec": [
                    {"name": "DATABASE_URL", "description": "PostgreSQL connection URI with credentials"},
                    {"name": "REDIS_URL", "description": "Redis connection URI for caching and queueing"},
                    {"name": "JWT_SECRET", "description": "Cryptographic key for signing access tokens"},
                    {"name": "STRIPE_SECRET_KEY", "description": "Stripe Connect API secret key"},
                    {"name": "STRIPE_WEBHOOK_SECRET", "description": "Secret for verifying inbound Stripe webhooks"}
                ],
                "cost_breakdown": [
                    {"service": "Frontend Web Hosting", "provider": "Vercel / AWS ECS", "tier_or_specs": "Serverless Next.js Pro", "estimated_monthly_usd": 20.0, "notes": "Scales automatically on demand"},
                    {"service": "Backend API Server", "provider": "AWS App Runner / Render", "tier_or_specs": "2 vCPU, 4GB RAM (2 instances)", "estimated_monthly_usd": 50.0, "notes": "High-availability auto-scaling"},
                    {"service": "PostgreSQL Managed DB", "provider": "Supabase / AWS RDS", "tier_or_specs": "db.t4g.medium (2 vCPU, 4GB RAM, 50GB SSD)", "estimated_monthly_usd": 65.0, "notes": "Daily automated backups and point-in-time recovery"},
                    {"service": "Redis Cache", "provider": "Upstash / AWS ElastiCache", "tier_or_specs": "1GB In-Memory Cache", "estimated_monthly_usd": 15.0, "notes": "Sub-millisecond latency for sessions and cache"},
                    {"service": "Object Storage & CDN", "provider": "Cloudflare R2 / AWS S3", "tier_or_specs": "100GB Storage + CDN Egress", "estimated_monthly_usd": 10.0, "notes": "Contractor portfolio photos and licenses"},
                    {"service": "LLM & AI Services", "provider": "Google Gemini / OpenAI", "tier_or_specs": "Pay-as-you-go API", "estimated_monthly_usd": 40.0, "notes": "Automated matching and assistant workflows"}
                ],
                "total_estimated_monthly_usd": 200.0,
                "monitoring_and_observability": "Prometheus scraping FastAPI `/metrics` endpoint; Grafana dashboards for latency & error rates; Sentry for exception tracking; OpenTelemetry for distributed trace propagation."
            }

        elif "SecurityArchitecture" in schema_name:
            return {
                "threat_model": [
                    {
                        "category": "Spoofing",
                        "threat_description": "Attacker impersonates a verified licensed contractor to defraud homeowners.",
                        "impact_level": "HIGH",
                        "mitigation_strategy": "Mandatory Stripe Identity KYC verification, license verification with state board APIs, and SMS 2FA upon login."
                    },
                    {
                        "category": "Tampering",
                        "threat_description": "Malicious user manipulates booking amount or escrow parameters in transit.",
                        "impact_level": "HIGH",
                        "mitigation_strategy": "Server-side price validation; all pricing derived strictly from database records; HMAC signature validation on Stripe webhooks."
                    },
                    {
                        "category": "Information Disclosure",
                        "threat_description": "Unauthorized actor accesses homeowner exact address before booking confirmation.",
                        "impact_level": "MEDIUM",
                        "mitigation_strategy": "Geographic fuzzing showing only zip code / approximate neighborhood until contract accepted."
                    },
                    {
                        "category": "Denial of Service",
                        "threat_description": "Botnet floods contractor search endpoint with high-frequency spatial queries.",
                        "impact_level": "MEDIUM",
                        "mitigation_strategy": "Redis token-bucket rate limiting (60 req/min per IP) and Cloudflare Bot Management."
                    },
                    {
                        "category": "Elevation of Privilege",
                        "threat_description": "Homeowner attempts to invoke contractor escrow payout disbursement endpoint.",
                        "impact_level": "HIGH",
                        "mitigation_strategy": "Granular RBAC role enforcement (`@require_role('contractor')`) and strict tenant ownership checks."
                    }
                ],
                "owasp_top_10_mitigations": [
                    {"vulnerability": "A01:2021-Broken Access Control", "relevance": "Direct object reference on bookings/payments", "preventative_measure": "Tenant-scoped database queries verifying `user_id == current_user.id` on every request."},
                    {"vulnerability": "A02:2021-Cryptographic Failures", "relevance": "Exposure of sensitive payment or KYC data", "preventative_measure": "Zero payment card storage on servers (delegated to PCI-DSS Level 1 Stripe); TLS 1.3 enforced."},
                    {"vulnerability": "A03:2021-Injection", "relevance": "SQL / NoSQL / Command injection", "preventative_measure": "100% parameterized queries via SQLAlchemy 2.0 ORM; strict Pydantic input validation."},
                    {"vulnerability": "A07:2021-Identification & Auth Failures", "relevance": "Credential stuffing & brute force", "preventative_measure": "Bcrypt password hashing with salt cost factor 12; exponential backoff on failed logins."}
                ],
                "rbac_permission_matrix": {
                    "homeowner": ["view:contractors", "create:booking", "authorize:escrow", "release:escrow", "write:review", "send:message"],
                    "contractor": ["manage:profile", "accept:booking", "submit:invoice", "request:escrow_release", "send:message"],
                    "admin": ["*"]
                },
                "encryption_standards": {
                    "in_transit": "TLS 1.3 with HSTS enabled (Strict-Transport-Security: max-age=31536000)",
                    "at_rest": "AES-256-GCM for database storage volumes and backups",
                    "passwords": "Bcrypt with 12 computational rounds"
                },
                "secrets_management": "Environment-driven secret injection via AWS Secrets Manager / Doppler; zero hardcoded tokens; automatic secret rotation every 90 days.",
                "security_hardening_checklist": [
                    "Security headers configured (Content-Security-Policy, X-Content-Type-Options: nosniff, X-Frame-Options: DENY)",
                    "CORS restricted to authorized frontend domains only",
                    "All RAG context sanitized and wrapped in <UNTRUSTED_CONTEXT> blocks",
                    "Automated Dependabot security vulnerability alerts enabled in GitHub"
                ]
            }

        elif "QAArchitecture" in schema_name:
            return {
                "test_strategy_overview": "A multi-layered test pyramid consisting of 70% Unit Tests (FastAPI endpoints, business calculations, prompt templates), 20% Integration Tests (PostgreSQL queries, Stripe mock webhooks, Redis pub/sub), and 10% End-to-End browser tests with Playwright.",
                "testing_tools": ["Pytest", "pytest-asyncio", "HTTPX", "Vitest", "React Testing Library", "Playwright"],
                "test_cases": [
                    {
                        "id": "TC-AUTH-01",
                        "category": "UNIT",
                        "feature": "Authentication",
                        "title": "User registration with valid credentials succeeds and returns JWT",
                        "preconditions": "Database is clean",
                        "steps": ["Send POST /api/v1/auth/register with valid email, name, password", "Verify HTTP 201 status", "Assert JWT token and user profile returned in response body"],
                        "expected_result": "User record created in database and valid Bearer token provided",
                        "priority": "HIGH"
                    },
                    {
                        "id": "TC-SEARCH-02",
                        "category": "INTEGRATION",
                        "feature": "Geospatial Search",
                        "title": "Search returns only contractors within specified radius and matching trade",
                        "preconditions": "5 contractors seeded across varying coordinates",
                        "steps": ["Send GET /api/v1/contractors/search?trade=plumbing&lat=37.77&lng=-122.41&radius_miles=10", "Verify HTTP 200", "Assert all returned contractors have trade 'plumbing' and distance <= 10 miles"],
                        "expected_result": "Accurate spatial filtering without leaking out-of-boundary records",
                        "priority": "HIGH"
                    },
                    {
                        "id": "TC-ESCROW-03",
                        "category": "E2E",
                        "feature": "Milestone Escrow Payment",
                        "title": "Complete booking, authorize escrow, complete job, and disburse payout",
                        "preconditions": "Homeowner and contractor logged in",
                        "steps": ["Homeowner books service", "Payment authorized with Stripe mock token", "Contractor marks job complete", "Homeowner approves completion", "Verify funds released to contractor account"],
                        "expected_result": "Escrow status transitions HELD -> RELEASED; balance updated",
                        "priority": "HIGH"
                    }
                ],
                "edge_cases_and_recovery": [
                    {"scenario": "Payment webhook arrives before booking database record commits", "mitigation": "Idempotent event processing with Redis retry queue and 3-second backoff."},
                    {"scenario": "Contractor cancels booking after escrow funds authorized", "mitigation": "Automated full refund triggered via Stripe Refund API without penalty fee."}
                ],
                "load_and_performance_criteria": "Sustained throughput of 500 requests/sec with P99 latency < 350ms; 0% error rate on escrow transaction processing under spike tests.",
                "sample_automated_test_code": """import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_contractor_search_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/contractors/search?trade=plumbing&lat=37.77&lng=-122.41")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list) or "items" in data
"""
            }

        elif "ConsistencyReport" in schema_name:
            return {
                "overall_valid": True,
                "score_percentage": 98,
                "issues": [
                    {
                        "severity": "INFO",
                        "source_domain": "Backend Engineer",
                        "target_domain": "Database Architect",
                        "issue_description": "Backend API models specify UUID string representation while Database specifies native UUID type; verified full compatibility.",
                        "suggested_fix": "Ensure Pydantic serializers convert UUID to str seamlessly."
                    },
                    {
                        "severity": "INFO",
                        "source_domain": "DevOps Engineer",
                        "target_domain": "Solution Architect",
                        "issue_description": "Docker Compose includes Redis 7-Alpine matching the Redis caching topology.",
                        "suggested_fix": "Maintain synchronized Redis version tag across ADRs and Dockerfile."
                    }
                ],
                "cross_domain_matrix": {
                    "Requirements vs Solution Architecture": "100% Aligned - All functional requirements mapped to services",
                    "Solution Architecture vs Database": "100% Aligned - PostgreSQL selected and schema matches entities",
                    "Database vs Backend API": "98% Aligned - REST endpoints reflect all database entities and relations",
                    "Backend API vs Security": "100% Aligned - STRIDE threat model covers all endpoints",
                    "QA Strategy vs Requirements": "100% Aligned - Test cases map to all high-priority user stories"
                }
            }

        elif "TechnicalDocumentation" in schema_name:
            return {
                "document_title": "ArchAI Master Software Architecture Blueprint: Local Services Marketplace",
                "version": "1.0.0",
                "executive_summary": "This document serves as the comprehensive, authoritative technical blueprint for the Local Services Marketplace platform. Formulated by the ArchAI multi-agent orchestration system, it defines the system topology, domain services, database schemas, REST APIs, UI wireflows, security defenses, and automated deployment pipelines.",
                "system_architecture_document": """# System Architecture Document (SAD)

## 1. Executive Overview
The Local Services Marketplace is an on-demand, multi-tenant digital platform built to connect homeowners with verified local contractors.

## 2. Architectural Principles & Topology
- **Modular Monolith Architecture** with decoupled domain service boundaries.
- **FastAPI Core** providing sub-100ms API response latency and auto-generated OpenAPI 3.1 specifications.
- **PostgreSQL 16 + PostGIS** delivering transactional consistency, ACID safety, and geospatial proximity queries.
- **Redis 7.2** managing high-speed session caching and WebSocket pub/sub messaging.
- **Next.js 14+ (App Router)** providing a modern, accessible, dark-themed responsive interface.

## 3. Technology Stack Matrix
| Domain | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+, TypeScript, Tailwind CSS, React Query | Server-side rendering, type safety, rich component ecosystem |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0 | High async performance, strict data validation, clean ORM |
| **Database** | PostgreSQL 16 with pgvector & PostGIS | Robust relational storage with vector & geospatial capabilities |
| **Cache & Broker** | Redis 7.2 | Low-latency caching, rate limiting, and pub/sub |
| **Payments** | Stripe Connect Custom/Express | PCI-DSS compliant marketplace payments & escrow holds |
| **Infrastructure** | Docker, Docker Compose, GitHub Actions | Multi-stage portable builds and automated CI/CD |
""",
                "software_requirements_specification": """# Software Requirements Specification (SRS)

## 1. System Scope
The platform facilitates instant discovery, transparent quote comparison, automated milestone escrow payment holding, and verified dispute resolution for residential home services.

## 2. Key Actors
1. **Homeowner**: Explores contractors, requests quotes, books services, authorizes escrow payments.
2. **Contractor**: Manages business profile, dispatches technicians, submits quotes, and requests payouts.
3. **Platform Administrator**: Audits KYC verifications, monitors dispute escalation, manages platform fees.

## 3. Non-Functional Performance Standards
- P95 API Latency < 150ms.
- 99.9% Platform Availability.
- OWASP Top 10 compliance and zero unencrypted PII in transit or at rest.
""",
                "developer_onboarding_guide": """# Developer Onboarding Guide

## Prerequisites
- Node.js >= 20.x
- Python >= 3.12
- Docker & Docker Compose

## Quickstart
```bash
# 1. Clone repository
git clone https://github.com/organization/archai-project.git
cd archai-project

# 2. Start container stack
docker compose up -d

# 3. Apply database migrations
docker compose exec api alembic upgrade head

# 4. Seed initial developer data
docker compose exec api python -m app.db.seed
```
Visit http://localhost:3000 to access the workspace.
""",
                "operations_manual": """# Operations & Runbook

## Health Checks
- Backend Health: `GET http://localhost:8000/api/v1/health`
- Database & Redis status returned in JSON health payload.

## Backup & Recovery
- PostgreSQL daily snapshots executed at 02:00 UTC.
- Retained for 30 days with Point-In-Time-Recovery (PITR).
"""
            }

        # Generic fallback
        return {
            "title": "Architecture Deliverable",
            "status": "COMPLETED",
            "content": f"Successfully generated deliverable for schema {schema_name}"
        }
