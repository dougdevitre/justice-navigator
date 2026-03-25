/**
 * @module @justice-os/navigator
 * @description Justice Navigator — Google Maps for legal problems.
 * Step-by-step journey mapping for the justice system.
 *
 * @example
 * ```typescript
 * import { JourneyGraph, PositionTracker, ActionRecommender } from '@justice-os/navigator';
 *
 * const journey = new JourneyGraph('eviction-defense');
 * journey.addNode({ id: 'notice', label: 'Received Notice', type: 'start' });
 * journey.addNode({ id: 'answer', label: 'File Answer', type: 'action', urgency: 'high' });
 * journey.addEdge('notice', 'answer', { deadline: '5 business days' });
 *
 * const tracker = new PositionTracker(journey);
 * tracker.setPosition('notice');
 *
 * const recommender = new ActionRecommender(journey, tracker);
 * const actions = recommender.getRecommendations();
 * ```
 */

export { JourneyGraph } from './journey/graph';
export { PositionTracker } from './journey/position-tracker';
export { ActionRecommender } from './recommendations/action-engine';
export { ResourceLinker } from './recommendations/resource-linker';
export { JourneyMap } from './components/JourneyMap';
export { StepCard } from './components/StepCard';
export { ProgressBar } from './components/ProgressBar';

export type {
  JourneyNode,
  JourneyEdge,
  JourneyPosition,
  PositionHistoryEntry,
  CaseType,
  NodeType,
  UrgencyLevel,
  ActionRecommendation,
  Resource,
  JourneyConfig,
} from './types';
