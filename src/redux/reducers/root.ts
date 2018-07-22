import { combineReducers, Reducer, Action } from 'redux'
import * as State from '../state'
import { media } from './media'
const resourceList = require('reason/redux/reducers/resourceListReducer.bs').reducer

// definition for this module used by hot reload
// make sure to update if any names change
export interface RootReducerModule {
    root: Reducer<State.Root, Action<any>>
}

export const root = combineReducers<State.Root>({
    media,
    resourceList
})

