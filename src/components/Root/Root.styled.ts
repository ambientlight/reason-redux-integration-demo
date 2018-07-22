import * as React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import { safe, StyledThemedProps } from '../../utils'
import { Classes } from './Root'
import Root from './Root.redux'
import { RootToolbarWidth, MediaProgressControlHeight, ResourceListWidth } from '../constants'

const StyledRoot = styled(Root)`
    display: flex;
    
    .${Classes.toolbar} {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        width: ${RootToolbarWidth}px;
        min-width: ${RootToolbarWidth}px;
        background-color: ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.grey[900], '#2a2a2a')};
        border-right: 1px solid ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.grey[800], 'lightgray')};
    }

    .${Classes.scene} {
        display: flex;
        height: 100vh;

        flex: 1;
        flex-direction: column;
        left: ${RootToolbarWidth}px;

        background-color: black;
    }

    button {
        color: ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.primary.light, 'white')};
    }

    video {
        width: 100%;
        height: calc(100% - ${MediaProgressControlHeight}px);
        object-fit: contain;
        opacity: 1.0;
        pointer-events: none;
    }
`

export default withTheme()(StyledRoot as any)