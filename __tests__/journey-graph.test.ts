/**
 * @module JourneyGraph Tests
 * @description Tests for the JourneyGraph class covering node/edge management,
 * pathfinding, and branch discovery.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { JourneyGraph } from '../src/journey/graph';
import type { JourneyNode, JourneyEdge } from '../src/types';

describe('JourneyGraph', () => {
  let graph: JourneyGraph;

  beforeEach(() => {
    graph = new JourneyGraph();
  });

  describe('addNode', () => {
    it('should add a node to the graph', () => {
      const node: JourneyNode = {
        id: 'step-1',
        label: 'File Petition',
        type: 'start',
      };
      graph.addNode(node);
      const retrieved = graph.getNode('step-1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.label).toBe('File Petition');
    });

    it('should reject duplicate node IDs', () => {
      const node: JourneyNode = { id: 'step-1', label: 'Step 1', type: 'start' };
      graph.addNode(node);
      expect(() => graph.addNode(node)).toThrow();
    });

    it('should store node metadata', () => {
      const node: JourneyNode = {
        id: 'step-2',
        label: 'Step 2',
        type: 'action',
        urgency: 'high',
        estimatedDuration: '2 hours',
        metadata: { courtType: 'family' },
      };
      graph.addNode(node);
      const retrieved = graph.getNode('step-2');
      expect(retrieved?.urgency).toBe('high');
      expect(retrieved?.metadata?.courtType).toBe('family');
    });
  });

  describe('addEdge', () => {
    it('should add a directed edge between two nodes', () => {
      graph.addNode({ id: 'a', label: 'A', type: 'start' });
      graph.addNode({ id: 'b', label: 'B', type: 'action' });
      graph.addEdge({ from: 'a', to: 'b' });

      const edges = graph.getEdgesFrom('a');
      expect(edges).toHaveLength(1);
      expect(edges[0].to).toBe('b');
    });

    it('should store edge conditions and deadlines', () => {
      graph.addNode({ id: 'a', label: 'A', type: 'decision' });
      graph.addNode({ id: 'b', label: 'B', type: 'action' });
      graph.addEdge({
        from: 'a',
        to: 'b',
        condition: 'If eligible',
        deadline: '5 business days',
      });

      const edges = graph.getEdgesFrom('a');
      expect(edges[0].condition).toBe('If eligible');
      expect(edges[0].deadline).toBe('5 business days');
    });

    it('should throw if source node does not exist', () => {
      graph.addNode({ id: 'b', label: 'B', type: 'action' });
      expect(() => graph.addEdge({ from: 'missing', to: 'b' })).toThrow();
    });
  });

  describe('findPath', () => {
    it('should find the shortest path between two nodes', () => {
      graph.addNode({ id: 'a', label: 'A', type: 'start' });
      graph.addNode({ id: 'b', label: 'B', type: 'action' });
      graph.addNode({ id: 'c', label: 'C', type: 'end' });
      graph.addEdge({ from: 'a', to: 'b' });
      graph.addEdge({ from: 'b', to: 'c' });

      const path = graph.findPath('a', 'c');
      expect(path).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array when no path exists', () => {
      graph.addNode({ id: 'a', label: 'A', type: 'start' });
      graph.addNode({ id: 'b', label: 'B', type: 'end' });
      // No edge between a and b
      const path = graph.findPath('a', 'b');
      expect(path).toEqual([]);
    });

    it('should handle direct connections', () => {
      graph.addNode({ id: 'a', label: 'A', type: 'start' });
      graph.addNode({ id: 'b', label: 'B', type: 'end' });
      graph.addEdge({ from: 'a', to: 'b' });

      const path = graph.findPath('a', 'b');
      expect(path).toEqual(['a', 'b']);
    });
  });

  describe('getBranches', () => {
    it('should return all outgoing edges from a decision node', () => {
      graph.addNode({ id: 'decision', label: 'Decision', type: 'decision' });
      graph.addNode({ id: 'path-a', label: 'Path A', type: 'action' });
      graph.addNode({ id: 'path-b', label: 'Path B', type: 'action' });
      graph.addEdge({ from: 'decision', to: 'path-a', label: 'Option A' });
      graph.addEdge({ from: 'decision', to: 'path-b', label: 'Option B' });

      const branches = graph.getBranches('decision');
      expect(branches).toHaveLength(2);
    });

    it('should return empty array for leaf nodes', () => {
      graph.addNode({ id: 'end', label: 'End', type: 'end' });
      const branches = graph.getBranches('end');
      expect(branches).toEqual([]);
    });
  });
});
