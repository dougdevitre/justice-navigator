/**
 * @module @justice-os/navigator/types
 * @description Core type definitions for the Justice Navigator system.
 * Defines the data structures for journey graphs, position tracking,
 * action recommendations, and resource linking.
 */

/** Urgency level for a journey step or action */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

/** The type of node in a journey graph */
export type NodeType = 'start' | 'action' | 'decision' | 'milestone' | 'end';

/** Supported case type identifiers */
export type CaseType =
  | 'eviction-defense'
  | 'child-custody'
  | 'debt-collection'
  | 'small-claims'
  | 'protective-order'
  | 'name-change'
  | 'expungement'
  | 'landlord-tenant'
  | 'divorce'
  | 'traffic'
  | 'benefits-appeal';

/**
 * A single node (step) in a legal journey graph.
 */
export interface JourneyNode {
  /** Unique identifier for this step */
  id: string;
  /** Human-readable label displayed to the user */
  label: string;
  /** Classification of this step */
  type: NodeType;
  /** How urgent this step is (affects recommendation priority) */
  urgency?: UrgencyLevel;
  /** Detailed description of what the user needs to do */
  description?: string;
  /** Estimated time to complete this step */
  estimatedDuration?: string;
  /** Resource IDs linked to this step */
  resourceIds?: string[];
  /** Metadata for case-type-specific behavior */
  metadata?: Record<string, unknown>;
}

/**
 * A directed edge (transition) between two journey nodes.
 */
export interface JourneyEdge {
  /** Source node ID */
  from: string;
  /** Target node ID */
  to: string;
  /** Human-readable condition for this transition (e.g., "If you received a summons") */
  condition?: string;
  /** Deadline relative to the source step (e.g., "5 business days") */
  deadline?: string;
  /** Label displayed on the edge in the visual graph */
  label?: string;
}

/**
 * The user's current position within a journey, including history.
 */
export interface JourneyPosition {
  /** The node ID the user is currently at */
  currentNodeId: string;
  /** Ordered list of previously completed node IDs */
  completedNodeIds: string[];
  /** Progress through the journey as a percentage (0-100) */
  progressPercent: number;
  /** Timestamp when the user arrived at the current node */
  arrivedAt: Date;
  /** History of position changes */
  history: PositionHistoryEntry[];
}

/**
 * A single entry in the user's position history.
 */
export interface PositionHistoryEntry {
  /** The node the user was at */
  nodeId: string;
  /** When the user arrived at this node */
  arrivedAt: Date;
  /** When the user left this node (undefined if current) */
  departedAt?: Date;
}

/**
 * A recommended next action for the user.
 */
export interface ActionRecommendation {
  /** The journey node this action corresponds to */
  node: JourneyNode;
  /** Computed urgency score (0-1, higher = more urgent) */
  urgencyScore: number;
  /** Human-readable reason for this recommendation */
  reason: string;
  /** Deadline date, if applicable */
  deadline?: Date;
  /** Resources that support this action */
  resources: Resource[];
}

/**
 * An external resource linked to a journey step.
 */
export interface Resource {
  /** Unique resource identifier */
  id: string;
  /** Display title */
  title: string;
  /** Resource type */
  type: 'legal-aid' | 'form' | 'deadline-calculator' | 'court-info' | 'article' | 'video';
  /** URL to the resource */
  url: string;
  /** Brief description */
  description?: string;
  /** Geographic availability (e.g., "CA", "US", "national") */
  jurisdiction?: string;
  /** Languages available */
  languages?: string[];
}

/**
 * Configuration for a journey graph instance.
 */
export interface JourneyConfig {
  /** The case type this journey covers */
  caseType: CaseType;
  /** Jurisdiction-specific overrides */
  jurisdiction?: string;
  /** Locale for step labels and descriptions */
  locale?: string;
}
