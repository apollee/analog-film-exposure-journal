# Analog Film Exposure Journal

## Azure Cloud Architecture Project

### Overview

Analog Film Exposure Journal is a cloud-native web application designed to help photographers using manual analog film cameras record and later review the exposure settings used for each frame of a film roll.

Because analog photography provides no immediate feedback, photographers often struggle to understand whether a photo was underexposed, overexposed, or correctly exposed until the film is developed. This application closes that feedback loop by allowing users to record their settings while shooting and evaluate the results later.

In addition to its functional purpose, the project is designed as an Azure architecture portfolio solution that demonstrates the use of managed cloud services for frontend hosting, authentication, serverless APIs, document storage, secret management, and observability.

### Problem Statement

Analog film photographers manually control exposure parameters such as ISO, aperture, and shutter speed, but receive delayed feedback once the film is developed. Without a structured way to record these settings per frame, it is difficult to:

- Identify recurring exposure mistakes
- Understand how lighting conditions affect results
- Improve technical photography skills over time

The goal of the project is to provide a cloud-based journaling system that supports both capture-time note taking and post-development review.

### Core Features

#### Authentication and User Access

- User sign-up and sign-in
- Secure access using Microsoft Entra External ID integrated with Azure Static Web Apps
- Route protection for authenticated journal features

#### Film Roll Management

- Create and manage film rolls
- Record film stock, ISO, camera, notes, and roll status

#### Frame-Level Exposure Logging

- Record exposure settings for each frame in a roll
- Store shutter speed, aperture, flash usage, and contextual notes

#### Post-Development Review

- Review frames after development
- Mark frames as underexposed, overexposed, or well exposed
- Add review notes to support learning over time

### Core Domain Model

The domain is intentionally modeled around the real workflow of shooting and developing analog film.

#### Film Roll

Represents a physical roll of film owned by a single user.

**Key attributes**

- Roll name
- Film stock
- ISO
- Camera used
- Notes
- Status
- Roll type

**Notes**

- A roll belongs to one user
- A roll contains multiple frames, typically 24 or 36
- A roll moves through a simple lifecycle from in progress to developed

#### Frame

Represents a single exposure within a roll.

**Key attributes**

- Frame number
- Aperture
- Shutter speed
- Flash usage
- Shooting note

**Notes**

- Each frame belongs to exactly one roll
- Frame data is stored separately from roll metadata to support scale and query efficiency

#### Frame Review

Represents the post-development evaluation of a frame.

**Key attributes**

- Exposure outcome
- Review note

**Notes**

- Review data is only added after the roll is marked as developed
- In implementation terms, review data is stored as part of the frame document

### Architecture Summary

The solution follows a layered cloud-native architecture on Microsoft Azure using managed platform services.

#### Presentation Layer

- Azure Static Web Apps: frontend framework (React)

#### Identity Layer

- Microsoft Entra External ID: authentication is handled through Azure Static Web Apps built-in authentication integration

#### Application Layer

- Azure Functions: hosts the backend HTTP API and business logic

#### Data Layer

- Azure Cosmos DB Serverless: stores application data using separate containers for rolls and frames

#### Security Layer

- Azure Key Vault: stores sensitive configuration such as Cosmos DB connection details

#### Observability Layer

- Application Insights: captures logs and telemetry for operational visibility

### Architecture Overview

The system is designed to keep responsibilities clearly separated across Azure-managed services:

- The frontend is delivered through Azure Static Web Apps
- User authentication is provided by Microsoft Entra External ID
- Backend API operations are handled by Azure Functions
- Application data is persisted in Azure Cosmos DB Serverless
- Secrets are retrieved from Azure Key Vault
- Telemetry is sent to Application Insights

This architecture is intentionally optimized for a small-scale workload with low to moderate traffic. It favors low fixed cost, operational simplicity, and fast delivery over high-throughput optimization.

### Data Model

The application uses **Azure Cosmos DB Serverless** with a multi-container design to support user isolation and efficient access patterns.

#### Containers

##### Rolls

Stores film roll metadata.

- **Partition key:** `/userId`

This supports efficient retrieval of all rolls belonging to a given user.

##### Frames

Stores individual frame data and optional review information.

- **Partition key:** `/rollId`

This supports efficient retrieval of all frames belonging to a given roll.

#### Sample Roll Document

```json
{
  "id": "roll-123",
  "userId": "user-456",
  "name": "Lisbon Street Trip",
  "filmStock": "KODAK_PORTRA_400",
  "iso": 400,
  "cameraUsed": "Canon AE-1",
  "notes": "Sunny afternoon walk",
  "status": "IN_PROGRESS",
  "rollType": "COLOR",
  "createdAt": "2026-02-18T18:00:00Z"
}
```

#### Sample Frame Document

```json
{
  "id": "frame-001",
  "rollId": "roll-123",
  "userId": "user-456",
  "frameNumber": 1,
  "settings": {
    "aperture": 8,
    "shutterSpeed": "1/125",
    "flashUsed": false
  },
  "note": "Shot indoors near window light",
  "review": {
    "exposure": "underexposed",
    "note": "Could have opened one stop more"
  },
  "createdAt": "2026-02-18T18:05:00Z"
}
```

#### Business Rule

Frame reviews can only be added when the roll has been marked as developed. This rule is enforced in the application layer.

### Authentication Flow

This application uses **Microsoft Entra External ID** through **Azure Static Web Apps authentication**.

The flow is as follows:

1. A user accesses the frontend hosted on Azure Static Web Apps.
2. Protected journal routes require authentication.
3. When authentication is required, Azure Static Web Apps redirects the user to Microsoft Entra External ID.
4. After successful sign-in, Azure Static Web Apps provides authenticated user context to the application.
5. The frontend uses that authenticated context when calling backend API endpoints.
6. The backend uses the authenticated user identity provided by the platform to authorize access to user-specific resources.

This approach avoids implementing a custom authentication system while still enforcing access control across protected application features.

### Security and Observability

The project includes several security and operational practices that support the overall architecture:

- Sensitive database connection details are stored in Azure Key Vault
- Secrets are retrieved by the backend and reused to avoid unnecessary repeated lookups
- Journal routes are protected through Azure Static Web Apps authentication rules
- Data is partitioned in Cosmos DB to align with user and roll access patterns
- Application logs and telemetry are sent to Application Insights
- Correlation identifiers are used in logging to support troubleshooting across requests

### Deployment

The solution is deployed as a set of managed Azure services:

- The frontend is hosted on **Azure Static Web Apps**
- The backend API is hosted on **Azure Functions**
- Authentication is provided by **Microsoft Entra External ID**
- Data is stored in **Azure Cosmos DB Serverless**
- Secrets are managed in **Azure Key Vault**
- Telemetry is captured in **Application Insights**

The project uses a GitHub-based deployment model so that changes to the codebase can be built and deployed through Azure-integrated workflows.

### Known Limitations and Future Improvements

The current solution is intentionally lightweight and scoped to a modest usage profile. The following areas are either known limitations or natural future enhancements:

- The architecture is designed for low to moderate traffic rather than large-scale sustained workloads
- Scanned image attachment support is not yet implemented
- Monitoring configuration can be further refined for production cost optimization
- If usage were to grow significantly, database request efficiency would need to be reviewed more closely
- Additional analytics and reporting features could improve the post-development learning experience

### Live Demo

The frontend is deployed using **Azure Static Web Apps** with GitHub-based CI/CD.

Live URL: https://www.analog-film-journal.com
