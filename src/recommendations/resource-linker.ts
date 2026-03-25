/**
 * @module ResourceLinker
 * @description Connects journey steps to relevant external resources such as
 * legal aid organizations, downloadable court forms, deadline calculators,
 * and court directory information. Resources are filtered by jurisdiction
 * and step relevance.
 *
 * @example
 * ```typescript
 * const linker = new ResourceLinker();
 * linker.registerResource({
 *   id: 'ca-legal-aid',
 *   title: 'California Legal Aid',
 *   type: 'legal-aid',
 *   url: 'https://www.calegalaid.org',
 *   jurisdiction: 'CA',
 * });
 * const resources = linker.getResourcesForStep('answer', 'CA');
 * ```
 */

import type { Resource } from '../types';

export class ResourceLinker {
  /** All registered resources, keyed by resource ID */
  private resources: Map<string, Resource> = new Map();

  /** Step-to-resource mapping: step ID -> set of resource IDs */
  private stepLinks: Map<string, Set<string>> = new Map();

  /**
   * Register a new resource in the linker.
   * @param resource - The resource to register
   */
  registerResource(resource: Resource): void {
    this.resources.set(resource.id, resource);
  }

  /**
   * Link a resource to a specific journey step.
   * @param stepId - The journey node ID
   * @param resourceId - The resource ID to link
   */
  linkToStep(stepId: string, resourceId: string): void {
    if (!this.stepLinks.has(stepId)) {
      this.stepLinks.set(stepId, new Set());
    }
    this.stepLinks.get(stepId)!.add(resourceId);
  }

  /**
   * Get all resources linked to a step, optionally filtered by jurisdiction.
   * @param stepId - The journey node ID
   * @param jurisdiction - Optional jurisdiction filter (e.g., "CA")
   * @returns Array of matching resources
   */
  getResourcesForStep(stepId: string, jurisdiction?: string): Resource[] {
    const resourceIds = this.stepLinks.get(stepId);
    if (!resourceIds) return [];

    let results = Array.from(resourceIds)
      .map((id) => this.resources.get(id))
      .filter((r): r is Resource => r !== undefined);

    if (jurisdiction) {
      results = results.filter(
        (r) => !r.jurisdiction || r.jurisdiction === jurisdiction || r.jurisdiction === 'national'
      );
    }

    return results;
  }

  /**
   * Search resources by type.
   * @param type - The resource type to filter by
   */
  getResourcesByType(type: Resource['type']): Resource[] {
    return Array.from(this.resources.values()).filter((r) => r.type === type);
  }

  /**
   * Get all registered resources.
   */
  getAllResources(): Resource[] {
    return Array.from(this.resources.values());
  }
}
