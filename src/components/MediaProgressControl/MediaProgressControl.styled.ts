import * as React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import { RootToolbarWidth } from '../constants'
import { safe, hexWithOpacity, StyledThemedProps } from '../../utils'
import MediaProgressControl from './MediaProgressControl.redux'
import { MediaProgressControlHeight } from '../constants'
import { Classes } from './MediaProgressControl'

const StyledMediaProgressControl = styled(MediaProgressControl)`
    height: ${MediaProgressControlHeight}px;
    background-color: ${(props: StyledThemedProps) => 
        hexWithOpacity(
            safe(props.theme)(theme => theme.palette.grey[900], '#2a2a2a'),
            0.85
        )
    };

    .${Classes.linearProgress} {
        flex: 1;
        height: 4px;
    }

    .${Classes.progressGadgetContainer} {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 20px;

        .${Classes.progressGadgetText} {
            padding: 0px 24px;
        }
    }
`

export default withTheme()(StyledMediaProgressControl as any)