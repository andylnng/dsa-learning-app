import type { ComponentType } from 'react'
import GrowthViz from './GrowthViz'
import { SortSelectionViz, SortInsertionViz, SortBubbleViz } from './SortingViz'

const registry: Record<string, ComponentType> = {
  croissance: GrowthViz,
  'tri:selection': SortSelectionViz,
  'tri:insertion': SortInsertionViz,
  'tri:bulles': SortBubbleViz,
}

export function getViz(key: string): ComponentType | undefined {
  return registry[key]
}
