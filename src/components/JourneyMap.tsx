/**
 * @module JourneyMap
 * @description React component that renders a visual journey map with the
 * user's current position highlighted ("You Are Here" indicator). Displays
 * completed steps, upcoming steps, and decision branches.
 *
 * @example
 * ```tsx
 * <JourneyMap
 *   graph={journeyGraph}
 *   position={positionTracker.getPosition()}
 *   onStepClick={(nodeId) => handleStepNavigation(nodeId)}
 * />
 * ```
 */

import React from 'react';
import type { JourneyGraph } from '../journey/graph';
import type { JourneyPosition } from '../types';

export interface JourneyMapProps {
  /** The journey graph to render */
  graph: JourneyGraph;
  /** The user's current position in the journey */
  position: JourneyPosition | null;
  /** Callback when a step node is clicked */
  onStepClick?: (nodeId: string) => void;
  /** Whether to show the "You Are Here" pulsing indicator */
  showPositionIndicator?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Visual journey map component displaying the legal process as an
 * interactive step-by-step graph with current position highlighting.
 */
export const JourneyMap: React.FC<JourneyMapProps> = ({
  graph,
  position,
  onStepClick,
  showPositionIndicator = true,
  className,
}) => {
  const nodes = graph.getAllNodes();
  const currentNodeId = position?.currentNodeId;
  const completedIds = new Set(position?.completedNodeIds ?? []);

  return (
    <div className={`justice-journey-map ${className ?? ''}`} role="navigation" aria-label="Legal journey map">
      {nodes.map((node) => {
        const isCurrent = node.id === currentNodeId;
        const isCompleted = completedIds.has(node.id);
        const stepStatus = isCurrent ? 'current' : isCompleted ? 'completed' : 'upcoming';

        return (
          <div
            key={node.id}
            className={`journey-step journey-step--${stepStatus}`}
            role="button"
            tabIndex={0}
            aria-current={isCurrent ? 'step' : undefined}
            onClick={() => onStepClick?.(node.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onStepClick?.(node.id);
              }
            }}
          >
            <div className="journey-step__indicator">
              {isCompleted && <span className="journey-step__check" aria-hidden="true" />}
              {isCurrent && showPositionIndicator && (
                <span className="journey-step__pulse" aria-label="You are here" />
              )}
            </div>
            <div className="journey-step__content">
              <h3 className="journey-step__label">{node.label}</h3>
              {node.description && (
                <p className="journey-step__description">{node.description}</p>
              )}
              {node.urgency && (
                <span className={`journey-step__urgency journey-step__urgency--${node.urgency}`}>
                  {node.urgency}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JourneyMap;
