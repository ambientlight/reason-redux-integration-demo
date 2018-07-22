import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import * as colors from '@material-ui/core/colors';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

import { injectGlobal } from 'styled-components'
import { storeDescriptor } from '../redux/store'
import Root from './Root/Root.styled'

injectGlobal`
    * {
        box-sizing: border-box;
    }

    body { 
        margin: 0; padding: 0;
        overflow-y: hidden;
    }
`

// base theme
const appTheme = createMuiTheme({
    palette: {
        primary: colors.grey,
        secondary: colors.amber
    },
    typography: {
        body1: {
            color: 'white'
        },
        caption: {
            color: 'white'
        },
        body2: {
            color: 'white'
        }
    }
})

const App = () => (
    <Provider store={storeDescriptor.store}>
        <PersistGate loading={null} persistor={storeDescriptor.persistor}>
            <MuiThemeProvider theme={appTheme}>
                <Root/>
            </MuiThemeProvider>
        </PersistGate>
    </Provider>
)

export default hot(module)(App)
