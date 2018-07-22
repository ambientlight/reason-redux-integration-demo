import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'

import { composeWithDevTools } from 'redux-devtools-extension'
import { createEpicMiddleware, combineEpics } from 'redux-observable'

import { root, RootReducerModule } from './reducers/root'
import { rootEpics } from './epics/root'
import { migrations } from './store-migrations'

declare const module: any

// hotfix for https://github.com/reactjs/redux/issues/2359
const reduxModule = require('redux');
reduxModule.__DO_NOT_USE__ActionTypes.INIT = '@@redux/INIT';
reduxModule.__DO_NOT_USE__ActionTypes.REPLACE = '@@redux/REPLACE';

const createElectronStorage = require("redux-persist-electron-storage").default
const persistConfig = {
    key: 'root',
    version: 26,
    storage: createElectronStorage(),
    migrate: createMigrate(migrations, { debug: true })
}

const epicMiddleware = createEpicMiddleware()

const configureStore = (history: History) => {
    
    const store = createStore(
        persistReducer(persistConfig, root) as any, {},
        composeWithDevTools(
            applyMiddleware(
                // middleware doesn't hot reload yet: reference https://github.com/reactjs/react-redux/issues/602 
                epicMiddleware
            )
        )
    )

    epicMiddleware.run(rootEpics)
    
    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./reducers/root', () => {
            const rootReduceModule: RootReducerModule = require('./reducers/root')
            store.replaceReducer(
                persistReducer(persistConfig, rootReduceModule.root)
            );
        })
    }

    return { store, persistor: persistStore(store) }
}

export const storeDescriptor = configureStore(history)
// uncomment to always start with a clean state
//storeDescriptor.persistor.purge()