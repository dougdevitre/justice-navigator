# Justice Navigator Data Model

## Entity Relationship Diagram

```mermaid
erDiagram
    JOURNEY_GRAPH {
        string id PK
        string caseType
        string jurisdiction
        string version
        datetime createdAt
        datetime updatedAt
    }

    JOURNEY_NODE {
        string id PK
        string graphId FK
        string label
        string type "start | action | decision | milestone | end"
        string urgency "low | medium | high | critical"
        string description
        string estimatedDuration
        json metadata
    }

    JOURNEY_EDGE {
        string id PK
        string graphId FK
        string fromNodeId FK
        string toNodeId FK
        string condition
        string deadline
        string label
    }

    USER_POSITION {
        string id PK
        string userId FK
        string graphId FK
        string currentNodeId FK
        float progress
        datetime lastMovedAt
    }

    POSITION_HISTORY {
        string id PK
        string positionId FK
        string nodeId FK
        datetime timestamp
        string action
    }

    RESOURCE {
        string id PK
        string title
        string type "form | legal-aid | deadline-calculator | court-directory"
        string url
        string jurisdiction
        json metadata
    }

    STEP_RESOURCE_LINK {
        string nodeId FK
        string resourceId FK
    }

    ACTION_RECOMMENDATION {
        string id PK
        string nodeId FK
        string label
        string urgency
        string description
        int priority
    }

    JOURNEY_GRAPH ||--o{ JOURNEY_NODE : contains
    JOURNEY_GRAPH ||--o{ JOURNEY_EDGE : contains
    JOURNEY_NODE ||--o{ JOURNEY_EDGE : "from"
    JOURNEY_NODE ||--o{ JOURNEY_EDGE : "to"
    JOURNEY_GRAPH ||--o{ USER_POSITION : tracks
    USER_POSITION ||--o{ POSITION_HISTORY : logs
    JOURNEY_NODE ||--o{ USER_POSITION : "current"
    JOURNEY_NODE ||--o{ STEP_RESOURCE_LINK : links
    RESOURCE ||--o{ STEP_RESOURCE_LINK : links
    JOURNEY_NODE ||--o{ ACTION_RECOMMENDATION : suggests
```

## Key Relationships

- A **Journey Graph** contains multiple **Nodes** and **Edges** forming a directed graph
- **Edges** connect nodes with optional conditions and deadlines for branching paths
- **User Position** tracks where a user currently is in a journey graph
- **Position History** logs every movement for audit and progress analysis
- **Resources** (forms, legal aid orgs, calculators) are linked to specific journey steps
- **Action Recommendations** are generated per-node based on urgency and context
