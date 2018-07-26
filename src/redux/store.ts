import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { switchMap } from 'rxjs/operators'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'

import { composeWithDevTools } from 'redux-devtools-extension'
import { createEpicMiddleware, combineEpics } from 'redux-observable'

import { root, RootReducerModule, storage } from './reducers/root'
import { rootEpics } from './epics/root'
import { migrations } from './store-migrations'

declare const module: any

// hotfix for https://github.com/reactjs/redux/issues/2359
const reduxModule = require('redux');
reduxModule.__DO_NOT_USE__ActionTypes.INIT = '@@redux/INIT';
reduxModule.__DO_NOT_USE__ActionTypes.REPLACE = '@@redux/REPLACE';

const persistConfig = {
    key: 'root',
    version: 26,
    storage,
    // nested persist is used to persist media, so its ignored it here, check ./reducers/root
    blacklist: ['media'],
    migrate: createMigrate(migrations, { debug: true })
}

const epicMiddleware = createEpicMiddleware()
const configureStore = (history: History) => {
    
    const store = createStore(
        persistReducer(persistConfig, root) as any, {},
        composeWithDevTools(
            applyMiddleware(
                epicMiddleware
            )
        )
    )

    const epic$ = new BehaviorSubject(rootEpics)
    // Every time a new epic is given to epic$ it
    // will unsubscribe from the previous one then
    // call and subscribe to the new one because of
    // how switchMap works
    const hotReloadingEpic = (...args: any[]) => epic$.pipe(
        switchMap(epic => epic(...args))
    )

    epicMiddleware.run(hotReloadingEpic as any)
    
    // Enable Webpack hot module replacement for reducers and middware(if needed)
    if (module.hot) {
        module.hot.accept('./reducers/root', () => {
            const rootReduceModule: RootReducerModule = require('./reducers/root')
            store.replaceReducer(
                persistReducer(persistConfig, rootReduceModule.root)
            );
        })

        if(ENVIRONMENT.shouldHotReloadEpics){
            console.log('Enabled hot reloading of epics')
            module.hot.accept('./epics/root', () => {
                const rootEpicsModule = require('./epics/root')
                epic$.next(rootEpicsModule.rootEpics)
                store.dispatch({ type: 'epics_swapped' })
            })
        } else {
            module.hot.decline('./epics/root')
        }

        // decline hot reload for store
        module.hot.decline()
    }

    return { store, persistor: persistStore(store) }
}

export const storeDescriptor = configureStore(history)
// uncomment to always start with a clean state
//storeDescriptor.persistor.purge()