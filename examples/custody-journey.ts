/**
 * @example Custody Case Journey
 * @description Demonstrates a child custody case journey with branching
 * decision paths based on whether the parties reach agreement or go to trial.
 */

import { JourneyGraph } from '../src/journey/graph';
import { PositionTracker } from '../src/journey/position-tracker';
import { ActionRecommender } from '../src/recommendations/action-engine';

async function main(): Promise<void> {
  // Build the custody journey graph
  const graph = new JourneyGraph();

  // Add journey nodes
  graph.addNode({
    id: 'petition',
    label: 'File Custody Petition',
    type: 'start',
    urgency: 'high',
    description: 'File initial petition for child custody with the family court.',
    estimatedDuration: '1-2 hours',
  });

  graph.addNode({
    id: 'serve-papers',
    label: 'Serve Other Parent',
    type: 'action',
    urgency: 'high',
    description: 'Serve custody papers to the other parent within required time frame.',
    estimatedDuration: '1-5 days',
  });

  graph.addNode({
    id: 'response-period',
    label: 'Wait for Response',
    type: 'action',
    urgency: 'medium',
    description: 'Wait for the other parent to file a response (usually 30 days).',
    estimatedDuration: '30 days',
  });

  graph.addNode({
    id: 'mediation-decision',
    label: 'Mediation or Trial?',
    type: 'decision',
    description: 'Decide whether to attempt mediation or proceed to trial.',
  });

  graph.addNode({
    id: 'mediation',
    label: 'Attend Mediation',
    type: 'action',
    urgency: 'medium',
    description: 'Attend court-ordered or voluntary mediation session.',
    estimatedDuration: '2-4 hours',
  });

  graph.addNode({
    id: 'agreement-reached',
    label: 'Agreement Reached',
    type: 'milestone',
    description: 'Both parties agree on a custody arrangement.',
  });

  graph.addNode({
    id: 'trial-prep',
    label: 'Prepare for Trial',
    type: 'action',
    urgency: 'high',
    description: 'Gather evidence, prepare witnesses, and work with attorney.',
    estimatedDuration: '2-4 weeks',
  });

  graph.addNode({
    id: 'trial',
    label: 'Custody Hearing/Trial',
    type: 'action',
    urgency: 'critical',
    description: 'Attend the custody hearing before the judge.',
    estimatedDuration: '1-3 days',
  });

  graph.addNode({
    id: 'order-issued',
    label: 'Custody Order Issued',
    type: 'end',
    description: 'Judge issues the custody order.',
  });

  // Add edges with conditions
  graph.addEdge({ from: 'petition', to: 'serve-papers', deadline: '5 business days' });
  graph.addEdge({ from: 'serve-papers', to: 'response-period' });
  graph.addEdge({ from: 'response-period', to: 'mediation-decision' });
  graph.addEdge({
    from: 'mediation-decision',
    to: 'mediation',
    condition: 'Both parties willing to mediate',
    label: 'Mediation path',
  });
  graph.addEdge({
    from: 'mediation-decision',
    to: 'trial-prep',
    condition: 'Mediation not possible or failed',
    label: 'Trial path',
  });
  graph.addEdge({
    from: 'mediation',
    to: 'agreement-reached',
    condition: 'Agreement reached in mediation',
  });
  graph.addEdge({
    from: 'mediation',
    to: 'trial-prep',
    condition: 'Mediation fails',
  });
  graph.addEdge({ from: 'agreement-reached', to: 'order-issued' });
  graph.addEdge({ from: 'trial-prep', to: 'trial' });
  graph.addEdge({ from: 'trial', to: 'order-issued' });

  // Track the user's position in the journey
  const tracker = new PositionTracker(graph);
  tracker.moveTo('petition');

  console.log('Current step:', tracker.getCurrentPosition());
  console.log('Progress:', tracker.getProgress());

  // Move through the journey
  tracker.moveTo('serve-papers');
  tracker.moveTo('response-period');
  tracker.moveTo('mediation-decision');

  // Take the mediation branch
  tracker.moveTo('mediation');

  console.log('\nJourney history:', tracker.getHistory());

  // Get recommended actions
  const recommender = new ActionRecommender();
  const actions = await recommender.getActions('mediation', graph);
  console.log('\nRecommended actions:', actions);

  // Get branches from the decision node
  const branches = graph.getBranches('mediation-decision');
  console.log('\nAvailable branches from decision:', branches);
}

main().catch(console.error);
