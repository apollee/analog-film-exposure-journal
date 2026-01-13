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
- Secure authentication using Azure AD B2C

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
- **Authentication:** Integrated using Azure AD B2C

#### Backend (API Layer)

- **Azure Functions** (serverless)


#### Data Layer

- **Azure Cosmos DB** (NoSQL)
- **Stores:** Film rolls, frames, and review data

## Live Demo

The frontend is deployed using **Azure Static Web Apps** with GitHub-based CI/CD. Every push to `main` triggers an automatic build and deployment.

🔗 Live URL: https://calm-sea-0d75bbc03.4.azurestaticapps.net

