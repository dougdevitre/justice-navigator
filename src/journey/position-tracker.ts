/**
 * @module PositionTracker
 * @description Tracks a user's current position within a JourneyGraph.
 * Maintains history of visited steps, calculates progress percentage,
 * and provides the "you are here" indicator that is central to the
 * Justice Navigator experience.
 *
 * @example
 * ```typescript
 * const tracker = new PositionTracker(journeyGraph);
 * tracker.setPosition('notice');
 * console.log(tracker.progressPercent); // 20
 * tracker.advanceTo('answer');
 * console.log(tracker.progressPercent); // 40
 * ```
 */

import type { JourneyGraph } from './graph';
import type { JourneyNode, JourneyPosition, PositionHistoryEntry } from '../types';

export class PositionTracker {
  /** The journey graph being tracked */
  private graph: JourneyGraph;

  /** Current node ID */
  private currentId: string | null = null;

  /** Set of completed node IDs */
  private completed: Set<string> = new Set();

  /** Chronological history of position changes */
  private positionHistory: PositionHistoryEntry[] = [];

  /**
   * Create a new PositionTracker for a journey graph.
   * @param graph - The JourneyGraph to track position within
   */
  constructor(graph: JourneyGraph) {
    this.graph = graph;
  }

  /**
   * Get the current step label.
   */
  get currentStep(): string | null {
    if (!this.currentId) return null;
    return this.graph.getNode(this.currentId)?.label ?? null;
  }

  /**
   * Get the current node.
   */
  get currentNode(): JourneyNode | null {
    if (!this.currentId) return null;
    return this.graph.getNode(this.currentId) ?? null;
  }

  /**
   * Get the list of next actions (neighboring nodes from the current position).
   */
  get nextActions(): JourneyNode[] {
    if (!this.currentId) return [];
    return this.graph.getNeighbors(this.currentId);
  }

  /**
   * Get progress through the journey as a percentage (0-100).
   */
  get progressPercent(): number {
    const totalSteps = this.graph.getLongestPathLength();
    if (totalSteps === 0) return 0;
    return Math.round((this.completed.size / totalSteps) * 100);
  }

  /**
   * Get the full current position state.
   */
  getPosition(): JourneyPosition | null {
    if (!this.currentId) return null;
    const lastEntry = this.positionHistory[this.positionHistory.length - 1];
    return {
      currentNodeId: this.currentId,
      completedNodeIds: Array.from(this.completed),
      progressPercent: this.progressPercent,
      arrivedAt: lastEntry?.arrivedAt ?? new Date(),
      history: [...this.positionHistory],
    };
  }

  /**
   * Set the user's position to a specific node (e.g., for initialization).
   * @param nodeId - The node ID to set as the current position
   * @throws Error if the node does not exist in the graph
   */
  setPosition(nodeId: string): void {
    const node = this.graph.getNode(nodeId);
    if (!node) {
      throw new Error(`Node "${nodeId}" does not exist in the journey graph.`);
    }

    this.closeCurrentEntry();
    this.currentId = nodeId;
    this.positionHistory.push({ nodeId, arrivedAt: new Date() });
  }

  /**
   * Advance the user to a neighboring node, marking the current node as complete.
   * @param nodeId - The target node ID to advance to
   * @throws Error if the target is not reachable from the current position
   */
  advanceTo(nodeId: string): void {
    if (!this.currentId) {
      throw new Error('No current position set. Call setPosition() first.');
    }

    const neighbors = this.graph.getNeighbors(this.currentId);
    const isReachable = neighbors.some((n) => n.id === nodeId);

    if (!isReachable) {
      throw new Error(
        `Cannot advance to "${nodeId}" — it is not reachable from "${this.currentId}".`
      );
    }

    this.completed.add(this.currentId);
    this.closeCurrentEntry();
    this.currentId = nodeId;
    this.positionHistory.push({ nodeId, arrivedAt: new Date() });
  }

  /**
   * Mark the current step as complete without advancing.
   */
  markCurrentComplete(): void {
    if (this.currentId) {
      this.completed.add(this.currentId);
    }
  }

  /**
   * Check whether a specific step has been completed.
   * @param nodeId - The node ID to check
   */
  isCompleted(nodeId: string): boolean {
    return this.completed.has(nodeId);
  }

  /**
   * Get the number of steps remaining (from current position to nearest end node).
   */
  getStepsRemaining(): number {
    if (!this.currentId) return 0;
    const endNodes = this.graph.getEndNodes();
    let shortest = Infinity;
    for (const end of endNodes) {
      const path = this.graph.findPath(this.currentId, end.id);
      if (path.length > 0 && path.length - 1 < shortest) {
        shortest = path.length - 1;
      }
    }
    return shortest === Infinity ? 0 : shortest;
  }

  /**
   * Reset the tracker to its initial state.
   */
  reset(): void {
    this.currentId = null;
    this.completed.clear();
    this.positionHistory = [];
  }

  /** Close the departure timestamp on the most recent history entry. */
  private closeCurrentEntry(): void {
    if (this.positionHistory.length > 0) {
      const last = this.positionHistory[this.positionHistory.length - 1];
      if (!last.departedAt) {
        last.departedAt = new Date();
      }
    }
  }
}
