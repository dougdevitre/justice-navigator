/**
 * @module ActionRecommender Tests
 * @description Tests for the ActionRecommender class covering action
 * retrieval and prioritization.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JourneyGraph } from '../src/journey/graph';
import { ActionRecommender } from '../src/recommendations/action-engine';

describe('ActionRecommender', () => {
  let recommender: ActionRecommender;
  let graph: JourneyGraph;

  beforeEach(() => {
    recommender = new ActionRecommender();
    graph = new JourneyGraph();

    graph.addNode({ id: 'start', label: 'Start', type: 'start', urgency: 'low' });
    graph.addNode({ id: 'urgent-step', label: 'File Answer', type: 'action', urgency: 'critical' });
    graph.addNode({ id: 'medium-step', label: 'Gather Docs', type: 'action', urgency: 'medium' });
    graph.addNode({ id: 'end', label: 'End', type: 'end' });
    graph.addEdge({ from: 'start', to: 'urgent-step' });
    graph.addEdge({ from: 'start', to: 'medium-step' });
    graph.addEdge({ from: 'urgent-step', to: 'end' });
    graph.addEdge({ from: 'medium-step', to: 'end' });
  });

  describe('getActions', () => {
    it('should return recommended actions for the current step', async () => {
      const actions = await recommender.getActions('start', graph);
      expect(actions).toBeDefined();
      expect(Array.isArray(actions)).toBe(true);
    });

    it('should return actions based on adjacent nodes', async () => {
      const actions = await recommender.getActions('start', graph);
      expect(actions.length).toBeGreaterThan(0);
    });

    it('should return empty actions for terminal nodes', async () => {
      const actions = await recommender.getActions('end', graph);
      expect(actions).toEqual([]);
    });
  });

  describe('prioritize', () => {
    it('should sort actions by urgency level', () => {
      const actions = [
        { id: '1', label: 'Low priority', urgency: 'low' as const },
        { id: '2', label: 'Critical priority', urgency: 'critical' as const },
        { id: '3', label: 'Medium priority', urgency: 'medium' as const },
      ];
      const sorted = recommender.prioritize(actions);
      expect(sorted[0].urgency).toBe('critical');
    });

    it('should handle empty action list', () => {
      const sorted = recommender.prioritize([]);
      expect(sorted).toEqual([]);
    });

    it('should preserve order for equal urgency', () => {
      const actions = [
        { id: '1', label: 'First high', urgency: 'high' as const },
        { id: '2', label: 'Second high', urgency: 'high' as const },
      ];
      const sorted = recommender.prioritize(actions);
      expect(sorted[0].id).toBe('1');
    });
  });
});
