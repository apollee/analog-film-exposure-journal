# Analog Film Exposure Journal

## Azure Cloud Architecture Project

### Overview

This project is a cloud-native web application designed to help photographers using manual analog film cameras record and later review the exposure settings used for each frame of a film roll.

Because analog photography provides no immediate feedback, photographers often struggle to understand whether a photo was underexposed, overexposed, or correctly exposed until the film is developed. This application aims to close that feedback loop by allowing users to record their settings at the time of shooting and analyze results after development.

In addition to its functional goal, this project serves as a portfolio-grade Azure cloud solution, demonstrating best practices in cloud architecture, security, serverless computing, and observability.

### Problem Statement

Analog film photographers manually control exposure parameters such as ISO (if pushing the film), aperture, and shutter speed, but receive delayed feedback once the film is developed. Without a systematic way to track these settings per frame, it is difficult to:

- Identify recurring exposure mistakes
- Understand how different lighting conditions affect results
- Improve technical photography skills over time

The goal of this project is to provide a cloud-based journaling system that allows photographers to record exposure data per frame and review outcomes after development.

### Core Features

#### Authentication & User Management

- User sign up and login
- Secure authentication using Microsoft Entra External ID

#### Film Roll Management

- Create and manage film rolls
- Record film stock details and shooting metadata

#### Frame-Level Exposure Logging

- Record exposure settings for each frame in a roll
- Add contextual notes per frame

#### Post-Development Review

- Mark frames as:
  - Underexposed
  - Overexposed
  - Correctly exposed
- Attach or link scanned images of developed frames **which may be added in a future iteration.**

### Core Domain Model

The domain is intentionally modeled around real analog photography workflows.

#### FilmRoll

Represents a physical roll of film.

**Attributes:**

- Film brand (e.g. Kodak, Ilford)
- Film type (Color / Black & White)
- ISO
- Roll name
- Identifier
- Start date
- End date
- Notes
- Optional image (used for frontend visualization)

**Notes:**

- A film roll is owned by a single user
- A roll contains multiple frames (typically 24 or 36)

#### Frame

Represents a single exposure on a film roll.

**Attributes:**

- Frame number
- Aperture (f-stop)
- Shutter speed
- Notes

**Notes:**

- Frames are associated with exactly one film roll

#### FrameReview

Represents the post-development evaluation of a frame.

**Attributes:**

- Exposure result (under / over / correct)
- Optional scanned image or external link **which may be added in a future iteration.**
- Review notes

**Notes:**

- Review data is only added after film development
- Separating this from the Frame object keeps shooting data and evaluation data conceptually distinct

### Architecture Overview

The system is designed using a layered, cloud-native architecture on Microsoft Azure.

#### Frontend (Presentation Layer)

- **Azure Static Web Apps**
- **Framework:** React
- **Authentication:** Integrated using Microsoft Entra External ID

#### Backend (API Layer)

- **Azure Functions** (serverless)


#### Data Layer

The application uses **Azure Cosmos DB (Serverless)** with a multi-container design to support multi-user isolation, efficient queries, and scalable frame storage.

##### Containers

###### Rolls
Stores film roll metadata.

**Partition Key:** `/userId`

This allows efficient retrieval of all rolls belonging to a specific user and provides natural tenant isolation.

###### Frames
Stores individual frame data, including exposure settings and optional review results.

**Partition Key:** `/rollId`

This enables efficient queries for retrieving all frames associated with a roll.

##### Roll Document Structure

Each roll represents a physical film roll created by a user.

```json
{
  "id": "roll-123",
  "userId": "user-456",
  "name": "Lisbon Street Trip",
  "filmStock": "Kodak Portra 400",
  "iso": 400,
  "notes": "Sunny afternoon",
  "status": "in_progress",
  "rollColor": "color",
  "createdAt": "2026-02-18T18:00:00Z"
}
```

##### Frame Document Structure

Each frame represents a single exposure within a roll. Frame reviews are embedded inside the frame document and are only added after the roll is completed.

```json
{
  "id": "frame-001",
  "rollId": "roll-123",
  "frameNumber": 1,
  "aperture": "f/2.8",
  "shutterSpeed": "1/125",
  "notes": "Shot indoors",
  "review": {
    "status": "underexposed",
    "notes": "Should have opened more the aperture",
  }
}
```

###### Business Rule

Frame reviews can only be created when the roll status is set to completed. This rule is enforced at the API level.

## Authentication Flow

This application uses **Microsoft Entra External ID** to authenticate users.

1. A user accesses the frontend application hosted on Azure Static Web Apps.
2. When authentication is required, the user is redirected to Microsoft Entra External ID.
3. After a successful login or sign-up, an access token (JWT) is issued.
4. The frontend stores the token and includes it in requests to protected API endpoints.
5. Azure Functions validate the token and authorize access to user-specific resources.

## Live Demo

The frontend is deployed using **Azure Static Web Apps** with GitHub-based CI/CD. Every push to `main` triggers an automatic build and deployment.

🔗 Live URL: https://calm-sea-0d75bbc03.4.azurestaticapps.net

