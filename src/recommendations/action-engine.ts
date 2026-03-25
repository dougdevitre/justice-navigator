/**
 * @module ActionRecommender
 * @description Evaluates the user's current journey position and produces
 * a prioritized list of recommended next actions. Scores actions based on
 * deadline proximity, step importance, resource availability, and urgency level.
 *
 * @example
 * ```typescript
 * const recommender = new ActionRecommender(graph, tracker);
 * const actions = recommender.getRecommendations();
 * // [{ node: {...}, urgencyScore: 0.9, reason: 'Deadline in 2 days' }]
 * ```
 */

import type { JourneyGraph } from '../journey/graph';
import type { PositionTracker } from '../journey/position-tracker';
import type { ActionRecommendation, JourneyNode, UrgencyLevel } from '../types';

/** Weights used for computing recommendation scores */
interface ScoringWeights {
  deadlineProximity: number;
  stepImportance: number;
  resourceAvailability: number;
  userReadiness: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  deadlineProximity: 0.4,
  stepImportance: 0.3,
  resourceAvailability: 0.2,
  userReadiness: 0.1,
};

const URGENCY_SCORES: Record<UrgencyLevel, number> = {
  critical: 1.0,
  high: 0.75,
  medium: 0.5,
  low: 0.25,
};

export class ActionRecommender {
  private graph: JourneyGraph;
  private tracker: PositionTracker;
  private weights: ScoringWeights;

  /**
   * @param graph - The journey graph to recommend actions from
   * @param tracker - The user's position tracker
   * @param weights - Optional custom scoring weights
   */
  constructor(
    graph: JourneyGraph,
    tracker: PositionTracker,
    weights: ScoringWeights = DEFAULT_WEIGHTS
  ) {
    this.graph = graph;
    this.tracker = tracker;
    this.weights = weights;
  }

  /**
   * Generate a prioritized list of recommended next actions.
   * @param limit - Maximum number of recommendations to return (default: 5)
   * @returns Sorted array of action recommendations (highest urgency first)
   */
  getRecommendations(limit: number = 5): ActionRecommendation[] {
    const nextNodes = this.tracker.nextActions;
    const recommendations: ActionRecommendation[] = nextNodes.map((node) => ({
      node,
      urgencyScore: this.scoreAction(node),
      reason: this.generateReason(node),
      resources: [],
    }));

    return recommendations
      .sort((a, b) => b.urgencyScore - a.urgencyScore)
      .slice(0, limit);
  }

  /**
   * Compute a composite urgency score for a given node.
   * @param node - The journey node to score
   * @returns Score between 0 and 1
   */
  private scoreAction(node: JourneyNode): number {
    const urgency = URGENCY_SCORES[node.urgency ?? 'medium'];
    const importance = this.getStepImportanceScore(node);

    return (
      this.weights.deadlineProximity * urgency +
      this.weights.stepImportance * importance +
      this.weights.resourceAvailability * 0.5 +
      this.weights.userReadiness * 0.5
    );
  }

  /**
   * Determine importance score based on node type.
   */
  private getStepImportanceScore(node: JourneyNode): number {
    switch (node.type) {
      case 'milestone':
        return 0.9;
      case 'action':
        return 0.7;
      case 'decision':
        return 0.6;
      default:
        return 0.4;
    }
  }

  /**
   * Generate a human-readable reason for the recommendation.
   */
  private generateReason(node: JourneyNode): string {
    if (node.urgency === 'critical') {
      return `Urgent: "${node.label}" requires immediate attention.`;
    }
    if (node.urgency === 'high') {
      return `Important: "${node.label}" should be completed soon.`;
    }
    if (node.type === 'milestone') {
      return `Milestone: "${node.label}" is a key checkpoint in your case.`;
    }
    return `Next step: "${node.label}" is the recommended next action.`;
  }
}
