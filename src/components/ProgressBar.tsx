/**
 * @module ProgressBar
 * @description Accessible progress bar component showing the user's progress
 * through their legal journey. Includes percentage, step count, and
 * encouraging messages at milestones.
 *
 * @example
 * ```tsx
 * <ProgressBar
 *   progressPercent={45}
 *   completedSteps={3}
 *   totalSteps={7}
 * />
 * ```
 */

import React from 'react';

export interface ProgressBarProps {
  /** Progress percentage (0-100) */
  progressPercent: number;
  /** Number of completed steps */
  completedSteps: number;
  /** Total number of steps in the journey */
  totalSteps: number;
  /** Whether to show encouraging milestone messages */
  showEncouragement?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/** Returns an encouraging message based on progress percentage */
function getEncouragement(percent: number): string | null {
  if (percent >= 100) return 'You did it! All steps complete.';
  if (percent >= 75) return 'Almost there — you are making great progress!';
  if (percent >= 50) return 'Halfway through. Keep going!';
  if (percent >= 25) return 'Great start — you are on the right track.';
  return null;
}

/**
 * Visual progress bar with step count and milestone encouragement.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  completedSteps,
  totalSteps,
  showEncouragement = true,
  className,
}) => {
  const clampedPercent = Math.min(100, Math.max(0, progressPercent));
  const encouragement = showEncouragement ? getEncouragement(clampedPercent) : null;

  return (
    <div className={`progress-bar ${className ?? ''}`}>
      <div className="progress-bar__header">
        <span className="progress-bar__label">
          {completedSteps} of {totalSteps} steps complete
        </span>
        <span className="progress-bar__percent">{clampedPercent}%</span>
      </div>

      <div
        className="progress-bar__track"
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Journey progress: ${clampedPercent}%`}
      >
        <div
          className="progress-bar__fill"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      {encouragement && (
        <p className="progress-bar__encouragement" aria-live="polite">
          {encouragement}
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
