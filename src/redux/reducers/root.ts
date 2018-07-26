import { combineReducers, Reducer, Action } from 'redux'
import * as State from '../state'
import { media } from './media'
import { persistReducer } from 'redux-persist'
const createElectronStorage = require("redux-persist-electron-storage").default
const resourceList = require('reason/redux/reducers/resourceListReducer.bs').reducer

export const storage = createElectronStorage()

// definition for this module used by hot reload
// make sure to update if any names change
export interface RootReducerModule {
    root: Reducer<State.Root, Action<any>>
}

const mediaPersistConfig = {
    key: "media",
    storage,
    blacklist: ['objectUrl']
}

export const root = combineReducers<State.Root>({
    media: persistReducer(mediaPersistConfig, media),
    resourceList
})

