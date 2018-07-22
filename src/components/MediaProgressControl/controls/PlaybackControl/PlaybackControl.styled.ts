import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import PlaybackControl from './PlaybackControl.redux'
const StyledPlaybackControl = styled(PlaybackControl)`
    display: flex;
    align-items: center;
`

export default withTheme()(StyledPlaybackControl as any)