# 🧭 Justice Navigator — Google Maps for Legal Problems

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript 5.0](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](CONTRIBUTING.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/dougdevitre/justice-navigator/pulls)

## The Problem

People don't fail because of a lack of tools — they fail because they don't know where they are in the process. Legal journeys like eviction defense, custody disputes, and debt collection are opaque, non-linear, and overwhelming. There is no "you are here" indicator for the justice system.

## The Solution

**Justice Navigator** is a step-by-step journey mapper that shows users exactly where they stand in their legal process, recommends next actions, surfaces relevant resources, and adapts to each user's specific situation. Think of it as turn-by-turn navigation for the legal system.

```mermaid
flowchart LR
    A[Case Type Selector] --> B[Journey Graph]
    B --> C[Position Tracker<br/>"You Are Here"]
    C --> D[Action Recommender]
    D --> E[Resource Connector]
    E --> F[Progress Dashboard]

    style A fill:#e8f5e9
    style C fill:#fff3e0
    style F fill:#e3f2fd
```

## Who This Helps

- **Self-represented litigants** navigating unfamiliar processes alone
- **Legal aid navigators** guiding clients through complex cases
- **Court self-help centers** providing structured assistance
- **Community advocates** supporting vulnerable populations

## Features

- **Legal journey mapping** for 10+ case types (eviction, custody, debt, small claims, and more)
- **"You are here" positioning** — always know your current step and what comes next
- **Next-action recommendations** with urgency scoring and deadline awareness
- **Resource linking** — connect to legal aid, downloadable forms, and deadline calculators
- **Branching paths** based on user situation (e.g., "Did you receive a summons?")
- **Progress tracking** with encouragement and milestone celebrations

## Quick Start

```bash
npm install @justice-os/navigator
```

```typescript
import { JourneyGraph, PositionTracker } from '@justice-os/navigator';

// Create an eviction defense journey
const journey = new JourneyGraph('eviction-defense');

journey.addNode({ id: 'notice', label: 'Received Notice', type: 'start' });
journey.addNode({ id: 'answer', label: 'File Answer', type: 'action', urgency: 'high' });
journey.addNode({ id: 'hearing', label: 'Attend Hearing', type: 'milestone' });

journey.addEdge('notice', 'answer', { deadline: '5 business days' });
journey.addEdge('answer', 'hearing', { deadline: '14 days after filing' });

// Track the user's position
const tracker = new PositionTracker(journey);
tracker.setPosition('notice');

console.log(tracker.currentStep);     // "Received Notice"
console.log(tracker.nextActions);     // [{ step: 'File Answer', urgency: 'high' }]
console.log(tracker.progressPercent); // 33
```

## Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Journey graph engine | 🔨 In Progress |
| 2 | Case type library (eviction, custody, debt) | 📋 Planned |
| 3 | Position tracking + progress | 📋 Planned |
| 4 | Action recommender with urgency | 📋 Planned |
| 5 | Resource connector (legal aid, forms) | 📋 Planned |
| 6 | Mobile companion app | 📋 Planned |

## Project Structure

```
src/
├── index.ts
├── journey/
│   ├── graph.ts              # JourneyGraph class — nodes, edges, branching
│   ├── position-tracker.ts   # PositionTracker — current step, history, progress %
│   └── case-types/
│       └── README.md
├── recommendations/
│   ├── action-engine.ts      # ActionRecommender — next steps, urgency scoring
│   └── resource-linker.ts    # ResourceLinker — legal aid, forms, services
├── components/
│   ├── JourneyMap.tsx        # Visual journey with current position
│   ├── StepCard.tsx          # Individual step details
│   └── ProgressBar.tsx
└── types/
    └── index.ts
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE) — Built for the public good.

---

## Justice OS Ecosystem

This repository is part of the **Justice OS** open-source ecosystem — 22 interconnected projects building the infrastructure for accessible justice technology.

### Core System Layer
| Repository | Description |
|-----------|-------------|
| [justice-os](https://github.com/dougdevitre/justice-os) | Core modular platform — the foundation |
| [justice-api-gateway](https://github.com/dougdevitre/justice-api-gateway) | Interoperability layer for courts |
| [legal-identity-layer](https://github.com/dougdevitre/legal-identity-layer) | Universal legal identity and auth |

### User Experience Layer
| Repository | Description |
|-----------|-------------|
| [justice-navigator](https://github.com/dougdevitre/justice-navigator) | Google Maps for legal problems |
| [mobile-court-access](https://github.com/dougdevitre/mobile-court-access) | Mobile-first court access kit |
| [cognitive-load-ui](https://github.com/dougdevitre/cognitive-load-ui) | Design system for stressed users |
| [multilingual-justice](https://github.com/dougdevitre/multilingual-justice) | Real-time legal translation |

### AI + Intelligence Layer
| Repository | Description |
|-----------|-------------|
| [vetted-legal-ai](https://github.com/dougdevitre/vetted-legal-ai) | RAG engine with citation validation |
| [justice-knowledge-graph](https://github.com/dougdevitre/justice-knowledge-graph) | Open data layer for laws and procedures |
| [legal-ai-guardrails](https://github.com/dougdevitre/legal-ai-guardrails) | AI safety SDK for justice use |

### Infrastructure + Trust Layer
| Repository | Description |
|-----------|-------------|
| [evidence-vault](https://github.com/dougdevitre/evidence-vault) | Privacy-first secure evidence storage |
| [court-notification-engine](https://github.com/dougdevitre/court-notification-engine) | Smart deadline and hearing alerts |
| [justice-analytics](https://github.com/dougdevitre/justice-analytics) | Bias detection and disparity dashboards |
| [evidence-timeline](https://github.com/dougdevitre/evidence-timeline) | Evidence timeline builder |

### Tools + Automation Layer
| Repository | Description |
|-----------|-------------|
| [court-doc-engine](https://github.com/dougdevitre/court-doc-engine) | TurboTax for legal filings |
| [justice-workflow-engine](https://github.com/dougdevitre/justice-workflow-engine) | Zapier for legal processes |
| [pro-se-toolkit](https://github.com/dougdevitre/pro-se-toolkit) | Self-represented litigant tools |
| [justice-score-engine](https://github.com/dougdevitre/justice-score-engine) | Access-to-justice measurement |

### Adoption Layer
| Repository | Description |
|-----------|-------------|
| [digital-literacy-sim](https://github.com/dougdevitre/digital-literacy-sim) | Digital literacy simulator |
| [legal-resource-discovery](https://github.com/dougdevitre/legal-resource-discovery) | Find the right help instantly |
| [court-simulation-sandbox](https://github.com/dougdevitre/court-simulation-sandbox) | Practice before the real thing |
| [justice-components](https://github.com/dougdevitre/justice-components) | Reusable component library |

> Built with purpose. Open by design. Justice for all.
