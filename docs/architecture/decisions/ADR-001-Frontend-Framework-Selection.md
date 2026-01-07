# ADR-001: Frontend Framework Selection

## Context
The project requires a single-page application frontend hosted on Azure Static Web Apps.
The frontend should be aligned with widely adopted industry practices and Azure ecosystem support.
Long-term extensibility, including potential mobile application development, was also considered.

## Decision
React was selected as the frontend framework.

## Considered Options
- React
- Vue

## Rationale
Vue was considered due to its suitability for small to medium-sized applications and its
lightweight, opinionated approach, which can improve developer productivity and readability
in solo or small-team projects.

However, React was selected for the following reasons:
- Stronger alignment with Azure documentation, tooling, and reference architectures
- Broader industry adoption and long-term ecosystem stability
- First-class support for mobile application development through React Native, enabling
  a potential future transition to native mobile platforms

## Consequences
- Additional libraries are required for routing and state management
- JSX syntax is required for frontend development
- The frontend architecture remains flexible for future expansion into mobile platforms
