import { combineEpics, ActionsObservable } from 'redux-observable'
import { mediaEpics } from './media'

export const rootEpics = combineEpics(mediaEpics) as any

