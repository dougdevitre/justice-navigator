# Justice Navigator — Architecture

## Overview

Justice Navigator models legal processes as directed graphs where nodes represent steps and edges represent transitions. A position tracker follows the user through the graph, and a recommendation engine suggests next actions based on the current position, deadlines, and available resources.

---

## 1. Journey Graph Model

The journey graph is the core data structure. Each case type (eviction, custody, debt) is represented as a directed acyclic graph with branching paths based on user circumstances.

```mermaid
graph TD
    subgraph JourneyGraph
        N1[JourneyNode] -->|JourneyEdge| N2[JourneyNode]
        N2 -->|branch: yes| N3[JourneyNode]
        N2 -->|branch: no| N4[JourneyNode]
        N3 --> N5[JourneyNode]
        N4 --> N5
    end

    subgraph NodeProperties
        NP1[id: string]
        NP2[label: string]
        NP3["type: start | action | decision | milestone | end"]
        NP4["urgency: low | medium | high | critical"]
        NP5[resources: Resource array]
    end

    subgraph EdgeProperties
        EP1[from: nodeId]
        EP2[to: nodeId]
        EP3[condition?: string]
        EP4[deadline?: string]
    end
```

---

## 2. Position Tracking Flow

The position tracker maintains the user's location in the journey graph, their history of completed steps, and calculates progress percentage.

```mermaid
sequenceDiagram
    participant User
    participant UI as JourneyMap Component
    participant PT as PositionTracker
    participant JG as JourneyGraph

    User->>UI: Marks step complete
    UI->>PT: advanceTo(nodeId)
    PT->>JG: validateTransition(current, next)
    JG-->>PT: valid / invalid
    PT->>PT: updateHistory()
    PT->>PT: calculateProgress()
    PT-->>UI: { currentStep, progress, nextActions }
    UI-->>User: Updated journey view
```

---

## 3. Recommendation Engine

The action recommender evaluates the user's current position, upcoming deadlines, and available branches to produce a prioritized list of next actions.

```mermaid
flowchart TD
    A[Current Position] --> B{Has Deadlines?}
    B -->|Yes| C[Score by Urgency]
    B -->|No| D[Score by Sequence]
    C --> E[Merge Scores]
    D --> E
    E --> F{Multiple Branches?}
    F -->|Yes| G[Present Decision Point]
    F -->|No| H[Single Next Action]
    G --> I[ActionRecommendation List]
    H --> I

    subgraph Scoring
        S1[Deadline proximity weight: 0.4]
        S2[Step importance weight: 0.3]
        S3[Resource availability weight: 0.2]
        S4[User readiness weight: 0.1]
    end
```

---

## 4. Resource Integration

The resource connector links each step in the journey to relevant external resources: legal aid organizations, downloadable forms, deadline calculators, and court information.

```mermaid
flowchart LR
    subgraph JourneyStep
        S[Current Step]
    end

    subgraph ResourceLinker
        RL[ResourceLinker]
        RL --> L1[Legal Aid Lookup]
        RL --> L2[Form Repository]
        RL --> L3[Deadline Calculator]
        RL --> L4[Court Directory]
    end

    subgraph Resources
        R1[Legal Aid Org]
        R2[PDF Form]
        R3[Deadline Date]
        R4[Court Info]
    end

    S --> RL
    L1 --> R1
    L2 --> R2
    L3 --> R3
    L4 --> R4
```

---

## Data Flow Summary

1. **User selects case type** -> loads the corresponding `JourneyGraph`
2. **Position tracker** initializes at the start node
3. **Journey map component** renders the graph with "you are here" indicator
4. **Action recommender** evaluates next steps and urgency
5. **Resource linker** attaches relevant resources to each recommended action
6. **Progress bar** updates as the user advances through the journey
