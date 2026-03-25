/**
 * @module JourneyGraph
 * @description Core graph data structure for modeling legal journeys.
 * Represents a legal process (e.g., eviction defense) as a directed graph
 * where nodes are steps and edges are transitions between steps.
 *
 * Supports branching paths (decision points), deadline-annotated edges,
 * and resource-linked nodes. The graph is the foundation that the
 * PositionTracker and ActionRecommender build upon.
 *
 * @example
 * ```typescript
 * const journey = new JourneyGraph('eviction-defense');
 * journey.addNode({ id: 'notice', label: 'Received Notice', type: 'start' });
 * journey.addNode({ id: 'answer', label: 'File Answer', type: 'action', urgency: 'high' });
 * journey.addEdge('notice', 'answer', { deadline: '5 business days' });
 * ```
 */

import type { JourneyNode, JourneyEdge, CaseType, NodeType } from '../types';

export class JourneyGraph {
  /** The case type this journey represents */
  public readonly caseType: CaseType;

  /** Internal node storage keyed by node ID */
  private nodes: Map<string, JourneyNode> = new Map();

  /** Adjacency list: source node ID -> list of edges */
  private adjacency: Map<string, JourneyEdge[]> = new Map();

  /** Reverse adjacency for backward traversal */
  private reverseAdjacency: Map<string, JourneyEdge[]> = new Map();

  /**
   * Create a new JourneyGraph for the specified case type.
   * @param caseType - The legal case type (e.g., 'eviction-defense')
   */
  constructor(caseType: CaseType) {
    this.caseType = caseType;
  }

  /**
   * Add a node (step) to the journey graph.
   * @param node - The journey node to add
   * @throws Error if a node with the same ID already exists
   */
  addNode(node: JourneyNode): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`Node with id "${node.id}" already exists in the journey graph.`);
    }
    this.nodes.set(node.id, node);
    if (!this.adjacency.has(node.id)) {
      this.adjacency.set(node.id, []);
    }
    if (!this.reverseAdjacency.has(node.id)) {
      this.reverseAdjacency.set(node.id, []);
    }
  }

  /**
   * Add a directed edge (transition) between two nodes.
   * @param from - Source node ID
   * @param to - Target node ID
   * @param options - Optional edge metadata (condition, deadline, label)
   * @throws Error if either node does not exist
   */
  addEdge(
    from: string,
    to: string,
    options: Omit<JourneyEdge, 'from' | 'to'> = {}
  ): void {
    if (!this.nodes.has(from)) {
      throw new Error(`Source node "${from}" does not exist.`);
    }
    if (!this.nodes.has(to)) {
      throw new Error(`Target node "${to}" does not exist.`);
    }

    const edge: JourneyEdge = { from, to, ...options };
    this.adjacency.get(from)!.push(edge);
    this.reverseAdjacency.get(to)!.push(edge);
  }

  /**
   * Get a node by its ID.
   * @param id - The node ID to look up
   * @returns The journey node, or undefined if not found
   */
  getNode(id: string): JourneyNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Get all nodes in the graph.
   * @returns Array of all journey nodes
   */
  getAllNodes(): JourneyNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get all nodes of a specific type.
   * @param type - The node type to filter by
   */
  getNodesByType(type: NodeType): JourneyNode[] {
    return this.getAllNodes().filter((n) => n.type === type);
  }

  /**
   * Get the neighboring nodes reachable from a given node.
   * @param nodeId - The source node ID
   * @returns Array of reachable neighbor nodes
   */
  getNeighbors(nodeId: string): JourneyNode[] {
    const edges = this.adjacency.get(nodeId) ?? [];
    return edges
      .map((edge) => this.nodes.get(edge.to))
      .filter((n): n is JourneyNode => n !== undefined);
  }

  /**
   * Get the outgoing edges from a node.
   * @param nodeId - The source node ID
   * @returns Array of outgoing edges
   */
  getOutgoingEdges(nodeId: string): JourneyEdge[] {
    return this.adjacency.get(nodeId) ?? [];
  }

  /**
   * Get the incoming edges to a node.
   * @param nodeId - The target node ID
   * @returns Array of incoming edges
   */
  getIncomingEdges(nodeId: string): JourneyEdge[] {
    return this.reverseAdjacency.get(nodeId) ?? [];
  }

  /**
   * Find the shortest path between two nodes using BFS.
   * @param startId - Starting node ID
   * @param endId - Ending node ID
   * @returns Ordered array of node IDs representing the path, or empty array if no path exists
   */
  findPath(startId: string, endId: string): string[] {
    if (!this.nodes.has(startId) || !this.nodes.has(endId)) {
      return [];
    }

    const visited = new Set<string>();
    const queue: string[][] = [[startId]];
    visited.add(startId);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];

      if (current === endId) {
        return path;
      }

      for (const edge of this.adjacency.get(current) ?? []) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push([...path, edge.to]);
        }
      }
    }

    return [];
  }

  /**
   * Get all branches (decision points) in the graph — nodes with multiple outgoing edges.
   * @returns Array of nodes that represent decision points
   */
  getBranches(): JourneyNode[] {
    return this.getAllNodes().filter((node) => {
      const edges = this.adjacency.get(node.id) ?? [];
      return edges.length > 1;
    });
  }

  /**
   * Get the start node(s) of the journey.
   * @returns Array of nodes with type 'start'
   */
  getStartNodes(): JourneyNode[] {
    return this.getNodesByType('start');
  }

  /**
   * Get the end node(s) of the journey.
   * @returns Array of nodes with type 'end'
   */
  getEndNodes(): JourneyNode[] {
    return this.getNodesByType('end');
  }

  /**
   * Calculate the total number of steps in the longest path through the graph.
   * Useful for progress percentage calculations.
   */
  getLongestPathLength(): number {
    const startNodes = this.getStartNodes();
    let maxLength = 0;

    for (const start of startNodes) {
      const visited = new Set<string>();
      const dfs = (nodeId: string, depth: number): void => {
        visited.add(nodeId);
        maxLength = Math.max(maxLength, depth);
        for (const edge of this.adjacency.get(nodeId) ?? []) {
          if (!visited.has(edge.to)) {
            dfs(edge.to, depth + 1);
          }
        }
        visited.delete(nodeId);
      };
      dfs(start.id, 1);
    }

    return maxLength;
  }

  /**
   * Serialize the graph to a plain object for storage or transfer.
   */
  toJSON(): { caseType: CaseType; nodes: JourneyNode[]; edges: JourneyEdge[] } {
    const edges: JourneyEdge[] = [];
    for (const edgeList of this.adjacency.values()) {
      edges.push(...edgeList);
    }
    return {
      caseType: this.caseType,
      nodes: this.getAllNodes(),
      edges,
    };
  }

  /**
   * Reconstruct a JourneyGraph from a serialized plain object.
   */
  static fromJSON(data: {
    caseType: CaseType;
    nodes: JourneyNode[];
    edges: JourneyEdge[];
  }): JourneyGraph {
    const graph = new JourneyGraph(data.caseType);
    for (const node of data.nodes) {
      graph.addNode(node);
    }
    for (const edge of data.edges) {
      graph.addEdge(edge.from, edge.to, {
        condition: edge.condition,
        deadline: edge.deadline,
        label: edge.label,
      });
    }
    return graph;
  }
}
