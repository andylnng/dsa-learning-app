import type { ComponentType } from 'react'
import GrowthViz from './GrowthViz'
import { SortSelectionViz, SortInsertionViz, SortBubbleViz } from './SortingViz'
import CallStackViz from './CallStackViz'
import RecursionTreeViz from './RecursionTreeViz'
import NQueensViz from './NQueensViz'

const registry: Record<string, ComponentType> = {
  croissance: GrowthViz,
  'tri:selection': SortSelectionViz,
  'tri:insertion': SortInsertionViz,
  'tri:bulles': SortBubbleViz,
  'pile-appels': CallStackViz,
  'arbre-recursion': RecursionTreeViz,
  'n-reines': NQueensViz,
}

export function getViz(key: string): ComponentType | undefined {
  return registry[key]
}
