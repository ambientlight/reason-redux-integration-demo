import * as React from 'react'
import { render } from 'react-dom'

// entry point other imports
import 'rxjs'
import 'typeface-roboto'

import App from './components/App'

const root = document.createElement('div')
document.body.appendChild(root)

render(<App />, root)