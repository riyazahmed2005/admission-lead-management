# Admission Lead Management System

A full-stack web application for managing student admission enquiries from initial lead capture through follow-ups, application tracking, payment tracking, and conversion.

This project was developed for **Edumerge Solutions – Pre-Drive Product Engineering Assignment, Assignment 5: Admission Lead Management**.

---

## 1. Project Overview

Educational institutions receive admission enquiries through multiple channels such as:

- Website
- Walk-ins
- Phone calls
- WhatsApp
- Education fairs
- Referrals
- Campaigns

The Admission Lead Management System provides a centralized platform for managing these enquiries throughout the admission lifecycle.

The system allows admission teams and counsellors to:

- Capture and manage student leads
- Assign leads to counsellors
- Track lead status and priority
- Schedule and maintain follow-ups
- Track follow-up history
- Create and manage student applications
- Track application status
- Track application fees and payment status
- View admission analytics
- Search and filter leads and applications

---

# 2. Problem Statement

The system is designed around the following business workflow:

```text
Lead Capture
     ↓
Counsellor Assignment
     ↓
Initial Contact
     ↓
Follow-up
     ↓
Qualification
     ↓
Application
     ↓
Application Review
     ↓
Conversion

The application provides a single place to manage this lifecycle instead of maintaining admission information across different spreadsheets, messages, calls, and manual records.

3. Key Features
3.1 Lead Management

The lead module supports:

Create new student leads
View individual lead details
Edit lead information
Delete leads
Search leads
Filter by status
Filter by priority
Filter by counsellor
Search by student name
Search by phone
Search by email
Search by city
Quick status updates
Lead Information

Each lead can contain:

Student Name
Phone
Email
City
Qualification
Course
Lead Source
Counsellor
Status
Priority
Created Date
Updated Date
3.2 Lead Status Management

The system supports the following lead stages:

New
Contacted
Interested
Follow-up
Qualified
Application Started
Application Submitted
Converted
Lost

Counsellors can update the status directly from the lead listing.

3.3 Lead Priority

Leads can be categorized as:

Low
Medium
High

This allows admission teams to distinguish leads requiring different levels of attention.

4. Follow-up Management

The follow-up module allows counsellors to maintain communication history for each lead.

Each follow-up can contain:

Lead
Counsellor
Follow-up Date
Communication Mode
Outcome
Remarks
Next Follow-up Date
Supported Communication Modes
Phone
WhatsApp
Email
Walk-in
Video Call
Example Workflow
Student contacted
        ↓
Outcome recorded
        ↓
Remarks added
        ↓
Next follow-up scheduled

The individual lead details page also displays the complete follow-up history for that student.

5. Application Management

The application module tracks the transition from lead to admission application.

Each application contains:

Application Number
Student
Course
Application Date
Application Status
Fee Amount
Payment Status
Remarks
Application Statuses
Not Started
In Progress
Submitted
Under Review
Approved
Rejected
Payment Statuses
Pending
Partial
Paid

Application numbers are unique.

A new application also moves a lead from New to Application Started when applicable.

6. Dashboard and Analytics

The dashboard provides visibility into the current admission pipeline.

KPI Metrics

The dashboard displays:

Total Leads
New Leads
Follow-ups
Converted Leads
Conversion Rate
Charts

The dashboard contains:

Lead Status Distribution
Leads by Source
Lead Priority Distribution

The dashboard uses the current PostgreSQL data rather than hardcoded values.

Conversion Rate

The backend calculates conversion rate using:

Converted Leads / Total Leads × 100
7. Search and Filtering

The lead management page supports:

Search
Student Name
Phone
Email
City
Filters
Status
Priority
Counsellor

The application management page supports search and filtering by:

Student
Application Number
Application Status
Payment Status
8. Technology Stack
Frontend
React
Vite
Tailwind CSS
React Router
Recharts
JavaScript
Backend
Python
FastAPI
SQLAlchemy
Pydantic
psycopg2
Database
PostgreSQL
9. System Architecture
┌──────────────────────────────┐
│          React UI            │
│                              │
│ Leads | Follow-ups           │
│ Applications | Dashboard     │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│        FastAPI Backend       │
│                              │
│ Routers                      │
│ Schemas                      │
│ Business Logic               │
│ SQLAlchemy ORM               │
└──────────────┬───────────────┘
               │
               │ SQLAlchemy
               ▼
┌──────────────────────────────┐
│       PostgreSQL Database    │
│                              │
│ Courses                      │
│ Lead Sources                 │
│ Counsellors                  │
│ Leads                        │
│ Follow-ups                   │
│ Applications                 │
└──────────────────────────────┘
10. Project Structure
admission-lead-management/
│
├── backend/
│   │
│   ├── app/
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── course.py
│   │   │   ├── lead_source.py
│   │   │   ├── counsellor.py
│   │   │   ├── lead.py
│   │   │   ├── follow_up.py
│   │   │   └── application.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── lead.py
│   │   │   ├── follow_up.py
│   │   │   └── application.py
│   │   │
│   │   ├── routers/
│   │   │   ├── leads.py
│   │   │   ├── follow_ups.py
│   │   │   ├── applications.py
│   │   │   ├── dashboard.py
│   │   │   └── master_data.py
│   │   │
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── FollowUps.jsx
│   │   │   ├── LeadDetails.jsx
│   │   │   └── Applications.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── AI-USAGE-REPORT.md
11. Database Design

The application uses a relational PostgreSQL database.

Main Tables
courses
lead_sources
counsellors
leads
followups
applications
Relationship Overview
Course
   │
   └──────────> Lead

Lead Source
   │
   └──────────> Lead

Counsellor
   │
   └──────────> Lead

Lead
 ├────────────> Follow-up
 └────────────> Application
Lead

A lead stores the core student enquiry information.

Follow-up

A lead can have multiple follow-up records.

Application

An application is associated with a lead and stores application and payment information.

12. Important Engineering Decisions
Why React?

React was selected for the frontend because the system contains multiple interactive views including:

Lead tables
Filters
Forms
Modals
Dashboard charts
Application management
Follow-up history
Why FastAPI?

FastAPI provides:

REST API support
Request validation
Automatic Swagger documentation
Clean route organization
Good integration with Python and SQLAlchemy
Why SQLAlchemy?

SQLAlchemy provides structured ORM-based database access and helps separate database models from API schemas.

Why PostgreSQL?

PostgreSQL was selected because this application contains relational business entities such as:

Leads
Courses
Counsellors
Sources
Follow-ups
Applications

A relational database makes these relationships explicit and supports referential integrity.

Why Recharts?

Recharts was used to display dashboard analytics such as:

Lead status distribution
Lead source distribution
Priority distribution
13. API Documentation

FastAPI automatically provides Swagger documentation.

After starting the backend, open:

http://127.0.0.1:8000/docs
14. API Endpoints
Leads
POST   /leads
GET    /leads
GET    /leads/{lead_id}
PUT    /leads/{lead_id}
DELETE /leads/{lead_id}
Example
GET /leads

Returns all leads.

GET /leads/1

Returns a specific lead.

15. Follow-up APIs
POST   /followups
GET    /followups
GET    /followups/{followup_id}
PUT    /followups/{followup_id}
DELETE /followups/{followup_id}

Follow-ups can also be filtered by:

lead_id
counsellor_id

Example:

GET /followups?lead_id=1
16. Application APIs
POST   /applications
GET    /applications
GET    /applications/{application_id}
PUT    /applications/{application_id}
DELETE /applications/{application_id}

Application filters include:

lead_id
status
payment_status

Example:

GET /applications?status=Approved
17. Dashboard API
GET /dashboard/stats

Example response structure:

{
  "total_leads": 10,
  "new_leads": 2,
  "contacted": 1,
  "interested": 2,
  "followups": 2,
  "applications": 2,
  "converted": 1,
  "lost": 1,
  "conversion_rate": 10.0
}

The actual values depend on the current database contents.

18. Master Data APIs
Courses
GET /master/courses
Lead Sources
GET /master/sources
Counsellors
GET /master/counsellors

These APIs provide reference data for the lead and application forms.

19. Validation

The frontend contains validation for common input errors.

Lead Validation
Required Fields
Student Name
Phone
Course
Lead Source
Counsellor
Phone Validation

The system expects a valid 10-digit Indian mobile number beginning with 6–9.

Example:

9876543210
Email Validation

When an email is provided, the system checks that it follows a basic email format.

20. Application Validation

The application module validates:

Student selection
Application number
Numeric fee value
Non-negative fee

The application number must be unique.

21. Edge Cases Considered

The system handles several failure scenarios.

Lead Not Found

Requesting a non-existing lead returns a 404 response.

Follow-up Not Found

Requesting a non-existing follow-up returns a 404 response.

Application Not Found

Requesting a non-existing application returns a 404 response.

Duplicate Application Number

Creating an application with an existing application number is rejected.

Empty Search Results

The frontend displays an appropriate empty state when no records match the selected filters.

Related Follow-ups When Deleting a Lead

Follow-up records are linked to their parent lead using a foreign-key relationship with cascade deletion configured at the database level.

22. Local Development Setup
Prerequisites

Install:

Python 3.11+
Node.js
npm
PostgreSQL
Git
23. Backend Setup

Open a terminal:

cd backend

Create or activate the virtual environment:

Windows
venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Configure the PostgreSQL database connection in:

backend/app/database.py

Start the backend:

uvicorn app.main:app --reload

Backend URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

Health endpoint:

http://127.0.0.1:8000/health
24. Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend URL:

http://localhost:5173
25. Application Pages
Dashboard
http://localhost:5173/

Provides:

KPIs
Analytics
Lead management
Search
Filters
Quick status update
Follow-ups
http://localhost:5173/followups

Provides follow-up management.

Applications
http://localhost:5173/applications

Provides application and payment tracking.

Lead Details
http://localhost:5173/leads/{lead_id}

Provides:

Student information
Lead information
Follow-up history
Add follow-up
26. Testing Performed

The following workflows were manually tested during development.

Lead Management
Create Lead          ✅
View Lead            ✅
Edit Lead            ✅
Delete Lead          ✅
Search Lead          ✅
Filter Lead          ✅
Quick Status Update  ✅
Follow-ups
Create Follow-up    ✅
View Follow-ups     ✅
Follow-up History   ✅
Delete Follow-up    ✅
Applications
Create Application  ✅
View Applications   ✅
Edit Application    ✅
Delete Application  ✅
Search              ✅
Status Filter       ✅
Payment Filter      ✅
Dashboard
KPI Metrics         ✅
Conversion Rate     ✅
Status Chart        ✅
Source Chart        ✅
Priority Chart      ✅
Database
PostgreSQL Connection       ✅
Foreign Key Relationships  ✅
Cascade Follow-up Delete   ✅
27. Example Business Flow

A typical student admission journey can be represented as:

Student Enquiry
      ↓
Lead Created
      ↓
Counsellor Assigned
      ↓
Initial Contact
      ↓
Interested
      ↓
Follow-up
      ↓
Qualified
      ↓
Application Started
      ↓
Application Submitted
      ↓
Application Review
      ↓
Approved
      ↓
Converted
28. Assumptions

The following assumptions were made while designing the prototype:

A lead represents a student admission enquiry.
Each lead can be assigned to a counsellor.
A lead can have multiple follow-up records.
A lead can have an application associated with it.
Lead status represents the current stage of the enquiry lifecycle.
Application status and payment status are tracked independently.
Course, lead source, and counsellor information are maintained as master data.
Authentication and role-based authorization are outside the scope of this prototype.
29. Trade-offs
Prototype Scope

The system focuses on the core admission workflow required for the assignment.

Features such as:

Authentication
Role-based authorization
Automated notifications
WhatsApp integration
Email integration
Production deployment

were kept outside the current prototype scope.

Frontend API Calls

The frontend communicates with the FastAPI backend through REST APIs.

For a production implementation, API configuration would be moved to environment variables instead of keeping the development API URL directly in the frontend code.

Dashboard

The current dashboard focuses on operational metrics and basic visual insights. A production version could add more advanced reporting such as:

Ageing by lead
Conversion by counsellor
Conversion by source
Monthly trends
Course-wise applications
Pending follow-ups
30. Security Considerations

For production deployment, the following should be added:

Authentication
Role-based access control
Secure environment variables
HTTPS
Input validation on both frontend and backend
Rate limiting
Audit logging
Database backups
Proper secrets management

No database password or secret key should be committed to the repository.

31. Future Improvements

Possible future enhancements include:

Authentication
Admin
Manager
Counsellor
Advanced Lead Management
Lead ageing
Duplicate lead detection
Bulk import
Bulk status update
Lead assignment rules
Follow-up Automation
Reminder notifications
Overdue follow-up alerts
Daily counsellor follow-up lists
Analytics
Monthly lead trends
Counsellor performance reports
Course-wise conversion
Source-wise conversion
Lead ageing reports
Integrations
WhatsApp
Email
SMS
CRM integrations
Reporting
CSV export
Excel export
PDF reports
32. Screenshots

Add screenshots of the following pages to the repository if required:

Dashboard
Lead Management
Lead Details
Follow-up History
Applications
Application Form
Swagger API Documentation

Recommended folder:

screenshots/

Example:

screenshots/
├── dashboard.png
├── leads.png
├── lead-details.png
├── followups.png
└── applications.png
33. AI-Assisted Development

AI-assisted development was used during the project for:

Architecture discussion
Database design assistance
API implementation assistance
React component implementation
Debugging
Validation improvements
UI improvements
Documentation assistance

The AI-generated implementation was manually tested and validated through:

FastAPI Swagger
Frontend workflows
PostgreSQL
CRUD operations
Validation scenarios
Error handling
Database relationship tests

A detailed AI Usage Report is included separately:

AI-USAGE-REPORT.md
34. Validation Example

One of the database issues identified during development involved deleting a lead that still had related follow-up records.

PostgreSQL returned a foreign-key violation because the child follow-up record referenced the lead.

The issue was identified from the database error and resolved by configuring the lead-to-follow-up foreign key with:

ON DELETE CASCADE

The deletion flow was then tested again successfully.

This demonstrated the importance of validating AI-generated implementation against the actual database schema and runtime behavior.

35. Project Status
Core Lead Management          ✅
Search and Filtering          ✅
Quick Status Updates          ✅
Follow-up Management          ✅
Lead Details                  ✅
Dashboard Analytics           ✅
Application Management        ✅
Payment Tracking              ✅
Input Validation              ✅
PostgreSQL Integration        ✅
REST APIs                     ✅
Swagger Documentation        ✅
AI Usage Documentation        ✅
