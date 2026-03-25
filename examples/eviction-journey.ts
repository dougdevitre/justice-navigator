/**
 * @example Eviction Defense Journey
 * @description Demonstrates building an eviction defense journey graph,
 * tracking the user's position through the process, and generating
 * next-action recommendations.
 *
 * Run: npx ts-node examples/eviction-journey.ts
 */

import { JourneyGraph, PositionTracker, ActionRecommender, ResourceLinker } from '../src';

// ── 1. Build the eviction defense journey graph ─────────────────────

const journey = new JourneyGraph('eviction-defense');

// Add nodes (steps in the eviction process)
journey.addNode({
  id: 'notice',
  label: 'Received Eviction Notice',
  type: 'start',
  description: 'You received a written notice from your landlord. This is the beginning of the process.',
  estimatedDuration: '1 day to review',
});

journey.addNode({
  id: 'review-notice',
  label: 'Review Notice for Defects',
  type: 'action',
  urgency: 'high',
  description: 'Check the notice for legal defects — wrong address, wrong notice period, missing information.',
  estimatedDuration: '30 minutes',
});

journey.addNode({
  id: 'seek-help',
  label: 'Contact Legal Aid',
  type: 'action',
  urgency: 'medium',
  description: 'Reach out to local legal aid for free assistance before filing your answer.',
  estimatedDuration: '1-2 days',
});

journey.addNode({
  id: 'file-answer',
  label: 'File Answer with Court',
  type: 'action',
  urgency: 'critical',
  description: 'File your written answer before the deadline. Missing this step can result in a default judgment.',
  estimatedDuration: '2-4 hours',
});

journey.addNode({
  id: 'decision-negotiate',
  label: 'Negotiate or Go to Hearing?',
  type: 'decision',
  description: 'Decide whether to attempt settlement negotiations or proceed directly to the hearing.',
});

journey.addNode({
  id: 'negotiate',
  label: 'Negotiate with Landlord',
  type: 'action',
  urgency: 'medium',
  description: 'Try to reach an agreement — payment plan, move-out date, repairs, etc.',
  estimatedDuration: '1-2 weeks',
});

journey.addNode({
  id: 'hearing',
  label: 'Attend Court Hearing',
  type: 'milestone',
  urgency: 'critical',
  description: 'Appear before the judge. Bring all documents, evidence, and witnesses.',
  estimatedDuration: '2-4 hours',
});

journey.addNode({
  id: 'outcome',
  label: 'Receive Court Decision',
  type: 'end',
  description: 'The judge issues a ruling. You may have options to appeal if the outcome is unfavorable.',
});

// Add edges (transitions between steps)
journey.addEdge('notice', 'review-notice', { deadline: 'Immediately' });
journey.addEdge('review-notice', 'seek-help', { deadline: '1-2 days' });
journey.addEdge('review-notice', 'file-answer', { deadline: '5 business days' });
journey.addEdge('seek-help', 'file-answer', { deadline: '5 business days from notice' });
journey.addEdge('file-answer', 'decision-negotiate');
journey.addEdge('decision-negotiate', 'negotiate', { condition: 'Want to try settlement' });
journey.addEdge('decision-negotiate', 'hearing', { condition: 'Proceed to hearing' });
journey.addEdge('negotiate', 'hearing', { condition: 'Settlement failed' });
journey.addEdge('hearing', 'outcome');

// ── 2. Set up resources ─────────────────────────────────────────────

const linker = new ResourceLinker();

linker.registerResource({
  id: 'lawhelp',
  title: 'LawHelp.org — Find Legal Aid',
  type: 'legal-aid',
  url: 'https://www.lawhelp.org',
  jurisdiction: 'national',
  description: 'Free legal help directory by state',
});

linker.registerResource({
  id: 'eviction-answer-form',
  title: 'Eviction Answer Form Template',
  type: 'form',
  url: 'https://example.com/eviction-answer',
  description: 'Fill-in-the-blank answer form for eviction cases',
});

linker.linkToStep('seek-help', 'lawhelp');
linker.linkToStep('file-answer', 'eviction-answer-form');

// ── 3. Track position and get recommendations ──────────────────────

const tracker = new PositionTracker(journey);
tracker.setPosition('notice');

console.log('=== Eviction Defense Journey ===\n');
console.log(`Current step: ${tracker.currentStep}`);
console.log(`Progress: ${tracker.progressPercent}%`);
console.log(`Steps remaining: ${tracker.getStepsRemaining()}`);

// Get recommended next actions
const recommender = new ActionRecommender(journey, tracker);
const actions = recommender.getRecommendations();

console.log(`\nRecommended next actions:`);
for (const action of actions) {
  console.log(`  - ${action.node.label} (urgency: ${action.urgencyScore.toFixed(2)}) — ${action.reason}`);
}

// Advance through the journey
console.log('\n--- Advancing to "Review Notice for Defects" ---\n');
tracker.advanceTo('review-notice');

console.log(`Current step: ${tracker.currentStep}`);
console.log(`Progress: ${tracker.progressPercent}%`);

const nextActions = recommender.getRecommendations();
console.log(`\nRecommended next actions:`);
for (const action of nextActions) {
  console.log(`  - ${action.node.label} (urgency: ${action.urgencyScore.toFixed(2)}) — ${action.reason}`);
}

// Show resources for the filing step
const filingResources = linker.getResourcesForStep('file-answer');
console.log(`\nResources for "File Answer":`);
for (const resource of filingResources) {
  console.log(`  - ${resource.title}: ${resource.url}`);
}

// Show branching (decision points)
const branches = journey.getBranches();
console.log(`\nDecision points in this journey:`);
for (const branch of branches) {
  const edges = journey.getOutgoingEdges(branch.id);
  console.log(`  - "${branch.label}" branches to:`);
  for (const edge of edges) {
    const target = journey.getNode(edge.to);
    console.log(`      → ${target?.label} ${edge.condition ? `(${edge.condition})` : ''}`);
  }
}
