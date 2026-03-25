# Case Type Library

This directory contains pre-built journey graphs for common legal case types.

## Planned Case Types

| Case Type | File | Status |
|-----------|------|--------|
| Eviction Defense | `eviction-defense.ts` | Planned |
| Child Custody | `child-custody.ts` | Planned |
| Debt Collection | `debt-collection.ts` | Planned |
| Small Claims | `small-claims.ts` | Planned |
| Protective Order | `protective-order.ts` | Planned |
| Name Change | `name-change.ts` | Planned |
| Expungement | `expungement.ts` | Planned |
| Divorce | `divorce.ts` | Planned |
| Traffic | `traffic.ts` | Planned |
| Benefits Appeal | `benefits-appeal.ts` | Planned |

## Contributing a Case Type

Each case type should export a factory function that returns a `JourneyGraph`:

```typescript
import { JourneyGraph } from '../graph';

export function createEvictionDefenseJourney(): JourneyGraph {
  const journey = new JourneyGraph('eviction-defense');
  // Add nodes and edges...
  return journey;
}
```

Please include jurisdiction-specific notes where applicable.
