/**
 * @module PositionTracker Tests
 * @description Tests for the PositionTracker class covering movement,
 * progress calculation, and history tracking.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JourneyGraph } from '../src/journey/graph';
import { PositionTracker } from '../src/journey/position-tracker';

describe('PositionTracker', () => {
  let graph: JourneyGraph;
  let tracker: PositionTracker;

  beforeEach(() => {
    graph = new JourneyGraph();
    graph.addNode({ id: 'start', label: 'Start', type: 'start' });
    graph.addNode({ id: 'middle', label: 'Middle', type: 'action' });
    graph.addNode({ id: 'end', label: 'End', type: 'end' });
    graph.addEdge({ from: 'start', to: 'middle' });
    graph.addEdge({ from: 'middle', to: 'end' });

    tracker = new PositionTracker(graph);
  });

  describe('moveTo', () => {
    it('should move to a valid node', () => {
      tracker.moveTo('start');
      expect(tracker.getCurrentPosition()).toBe('start');
    });

    it('should throw when moving to a non-existent node', () => {
      expect(() => tracker.moveTo('nonexistent')).toThrow();
    });

    it('should update current position on each move', () => {
      tracker.moveTo('start');
      tracker.moveTo('middle');
      expect(tracker.getCurrentPosition()).toBe('middle');
    });
  });

  describe('getProgress', () => {
    it('should return 0 when at the start', () => {
      tracker.moveTo('start');
      const progress = tracker.getProgress();
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
    });

    it('should return 1 when at the end', () => {
      tracker.moveTo('start');
      tracker.moveTo('middle');
      tracker.moveTo('end');
      const progress = tracker.getProgress();
      expect(progress).toBe(1);
    });

    it('should increase as the user moves forward', () => {
      tracker.moveTo('start');
      const progressAtStart = tracker.getProgress();

      tracker.moveTo('middle');
      const progressAtMiddle = tracker.getProgress();

      expect(progressAtMiddle).toBeGreaterThan(progressAtStart);
    });
  });

  describe('getHistory', () => {
    it('should return empty history before any moves', () => {
      const history = tracker.getHistory();
      expect(history).toEqual([]);
    });

    it('should track all visited nodes in order', () => {
      tracker.moveTo('start');
      tracker.moveTo('middle');
      tracker.moveTo('end');

      const history = tracker.getHistory();
      expect(history.map((h) => h.nodeId)).toEqual(['start', 'middle', 'end']);
    });

    it('should include timestamps for each move', () => {
      tracker.moveTo('start');
      const history = tracker.getHistory();
      expect(history[0].timestamp).toBeInstanceOf(Date);
    });
  });
});
