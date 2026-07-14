import type { ComponentType } from 'react'
import GrowthViz from './GrowthViz'
import { SortSelectionViz, SortInsertionViz, SortBubbleViz } from './SortingViz'
import CallStackViz from './CallStackViz'
import RecursionTreeViz from './RecursionTreeViz'
import NQueensViz from './NQueensViz'
import GameTreeViz from './GameTreeViz'
import StackQueueViz from './StackQueueViz'
import HeapViz from './HeapViz'
import BSTViz from './BSTViz'
import RotationViz from './RotationViz'
import RBInsertViz from './RBInsertViz'
import RBDeleteViz from './RBDeleteViz'
import HashViz from './HashViz'
import { BFSViz, DFSViz } from './GraphTraversalViz'
import EulerViz from './EulerViz'
import DijkstraViz from './DijkstraViz'
import AStarViz from './AStarViz'
import ActivityViz from './ActivityViz'

const registry: Record<string, ComponentType> = {
  croissance: GrowthViz,
  'tri:selection': SortSelectionViz,
  'tri:insertion': SortInsertionViz,
  'tri:bulles': SortBubbleViz,
  'pile-appels': CallStackViz,
  'arbre-recursion': RecursionTreeViz,
  'n-reines': NQueensViz,
  'arbre-de-jeu': GameTreeViz,
  'pile-file': StackQueueViz,
  heap: HeapViz,
  bst: BSTViz,
  rotation: RotationViz,
  'rn-insertion': RBInsertViz,
  'rn-suppression': RBDeleteViz,
  hachage: HashViz,
  bfs: BFSViz,
  dfs: DFSViz,
  euler: EulerViz,
  dijkstra: DijkstraViz,
  astar: AStarViz,
  activites: ActivityViz,
}

export function getViz(key: string): ComponentType | undefined {
  return registry[key]
}
