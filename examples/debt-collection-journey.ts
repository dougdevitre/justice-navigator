/**
 * @example Debt Collection Defense Journey
 * @description Demonstrates a debt defense journey where a user has been
 * sued by a debt collector. Includes branching for dispute validation,
 * statute of limitations checks, and negotiation vs. trial paths.
 */

import { JourneyGraph } from '../src/journey/graph';
import { PositionTracker } from '../src/journey/position-tracker';
import { ResourceLinker } from '../src/recommendations/resource-linker';

async function main(): Promise<void> {
  const graph = new JourneyGraph();

  // Build the debt defense journey
  graph.addNode({
    id: 'received-summons',
    label: 'Received Debt Collection Summons',
    type: 'start',
    urgency: 'critical',
    description: 'You have been served with a summons and complaint from a debt collector.',
    estimatedDuration: '30 minutes to review',
  });

  graph.addNode({
    id: 'verify-debt',
    label: 'Verify the Debt',
    type: 'action',
    urgency: 'high',
    description: 'Send a debt verification letter to the collector within 30 days.',
    estimatedDuration: '1-2 hours',
  });

  graph.addNode({
    id: 'check-sol',
    label: 'Check Statute of Limitations',
    type: 'action',
    urgency: 'high',
    description: 'Determine if the debt is outside the statute of limitations in your state.',
    estimatedDuration: '1 hour',
  });

  graph.addNode({
    id: 'sol-decision',
    label: 'Is Debt Time-Barred?',
    type: 'decision',
    description: 'Determine if the statute of limitations has expired.',
  });

  graph.addNode({
    id: 'file-sol-defense',
    label: 'File Statute of Limitations Defense',
    type: 'action',
    urgency: 'high',
    description: 'File an answer asserting the statute of limitations defense.',
    estimatedDuration: '2-3 hours',
  });

  graph.addNode({
    id: 'file-answer',
    label: 'File Answer to Complaint',
    type: 'action',
    urgency: 'critical',
    description: 'File your written answer to the complaint before the deadline (usually 20-30 days).',
    estimatedDuration: '3-4 hours',
  });

  graph.addNode({
    id: 'negotiate-decision',
    label: 'Negotiate or Defend?',
    type: 'decision',
    description: 'Decide whether to negotiate a settlement or defend in court.',
  });

  graph.addNode({
    id: 'negotiate',
    label: 'Negotiate Settlement',
    type: 'action',
    urgency: 'medium',
    description: 'Negotiate a reduced payment or payment plan with the collector.',
    estimatedDuration: '1-2 weeks',
  });

  graph.addNode({
    id: 'trial',
    label: 'Attend Court Hearing',
    type: 'action',
    urgency: 'critical',
    description: 'Appear in court to defend against the debt collection lawsuit.',
    estimatedDuration: '1 day',
  });

  graph.addNode({
    id: 'case-resolved',
    label: 'Case Resolved',
    type: 'end',
    description: 'The debt collection case has been resolved through dismissal, settlement, or judgment.',
  });

  // Edges
  graph.addEdge({ from: 'received-summons', to: 'verify-debt', deadline: '30 days' });
  graph.addEdge({ from: 'verify-debt', to: 'check-sol' });
  graph.addEdge({ from: 'check-sol', to: 'sol-decision' });
  graph.addEdge({
    from: 'sol-decision',
    to: 'file-sol-defense',
    condition: 'Debt is outside statute of limitations',
    label: 'Time-barred',
  });
  graph.addEdge({
    from: 'sol-decision',
    to: 'file-answer',
    condition: 'Debt is within statute of limitations',
    label: 'Active debt',
  });
  graph.addEdge({ from: 'file-sol-defense', to: 'case-resolved' });
  graph.addEdge({ from: 'file-answer', to: 'negotiate-decision' });
  graph.addEdge({
    from: 'negotiate-decision',
    to: 'negotiate',
    condition: 'Willing to settle',
    label: 'Settlement path',
  });
  graph.addEdge({
    from: 'negotiate-decision',
    to: 'trial',
    condition: 'Dispute the debt fully',
    label: 'Trial path',
  });
  graph.addEdge({ from: 'negotiate', to: 'case-resolved' });
  graph.addEdge({ from: 'trial', to: 'case-resolved' });

  // Link resources to steps
  const linker = new ResourceLinker();
  linker.registerResource({
    id: 'debt-verification-letter',
    title: 'Debt Verification Letter Template',
    type: 'form',
    url: 'https://forms.justice-os.org/debt-verification',
    jurisdiction: 'US',
  });
  linker.registerResource({
    id: 'sol-calculator',
    title: 'Statute of Limitations Calculator',
    type: 'deadline-calculator',
    url: 'https://tools.justice-os.org/sol-calculator',
    jurisdiction: 'US',
  });
  linker.registerResource({
    id: 'answer-template',
    title: 'Answer to Debt Collection Complaint',
    type: 'form',
    url: 'https://forms.justice-os.org/debt-answer',
    jurisdiction: 'US',
  });

  linker.linkToStep('verify-debt', 'debt-verification-letter');
  linker.linkToStep('check-sol', 'sol-calculator');
  linker.linkToStep('file-answer', 'answer-template');

  // Walk through the journey
  const tracker = new PositionTracker(graph);
  tracker.moveTo('received-summons');
  tracker.moveTo('verify-debt');

  console.log('Current step:', tracker.getCurrentPosition());
  console.log('Progress:', tracker.getProgress());

  // Get resources for the current step
  const resources = linker.getResourcesForStep('verify-debt', 'US');
  console.log('\nAvailable resources:', resources);

  // Show the full path to resolution
  const path = graph.findPath('received-summons', 'case-resolved');
  console.log('\nShortest path to resolution:', path);
}

main().catch(console.error);
