/**
 * @module StepCard
 * @description React component that renders detailed information about a
 * single journey step, including its label, description, urgency level,
 * estimated duration, and linked resources.
 *
 * @example
 * ```tsx
 * <StepCard
 *   node={currentNode}
 *   resources={linkedResources}
 *   isCurrent={true}
 *   onActionClick={() => advanceToNext()}
 * />
 * ```
 */

import React from 'react';
import type { JourneyNode, Resource } from '../types';

export interface StepCardProps {
  /** The journey node to display */
  node: JourneyNode;
  /** Resources linked to this step */
  resources?: Resource[];
  /** Whether this is the user's current step */
  isCurrent?: boolean;
  /** Whether this step has been completed */
  isCompleted?: boolean;
  /** Callback when the primary action button is clicked */
  onActionClick?: () => void;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Card component displaying detailed information about a single step
 * in the legal journey, including actionable resources.
 */
export const StepCard: React.FC<StepCardProps> = ({
  node,
  resources = [],
  isCurrent = false,
  isCompleted = false,
  onActionClick,
  className,
}) => {
  return (
    <article
      className={`step-card ${isCurrent ? 'step-card--current' : ''} ${isCompleted ? 'step-card--completed' : ''} ${className ?? ''}`}
      aria-label={`Step: ${node.label}`}
    >
      <header className="step-card__header">
        <h3 className="step-card__title">{node.label}</h3>
        {node.urgency && (
          <span className={`step-card__badge step-card__badge--${node.urgency}`}>
            {node.urgency}
          </span>
        )}
      </header>

      {node.description && (
        <p className="step-card__description">{node.description}</p>
      )}

      {node.estimatedDuration && (
        <p className="step-card__duration">
          Estimated time: {node.estimatedDuration}
        </p>
      )}

      {resources.length > 0 && (
        <div className="step-card__resources">
          <h4 className="step-card__resources-title">Helpful Resources</h4>
          <ul className="step-card__resource-list">
            {resources.map((resource) => (
              <li key={resource.id} className="step-card__resource-item">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="step-card__resource-link"
                >
                  {resource.title}
                </a>
                {resource.description && (
                  <span className="step-card__resource-desc">{resource.description}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isCurrent && onActionClick && (
        <button className="step-card__action-btn" onClick={onActionClick}>
          Mark Complete &amp; Continue
        </button>
      )}
    </article>
  );
};

export default StepCard;
