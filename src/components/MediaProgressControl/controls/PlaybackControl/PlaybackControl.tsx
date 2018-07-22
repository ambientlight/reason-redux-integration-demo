import * as React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { PlayArrow, Pause, FirstPage } from '@material-ui/icons'
import { Classes } from '../../MediaProgressControl'

import { StyledThemedProps } from '../../../../utils'

export interface PlaybackControlProps extends StyledThemedProps {}
interface ConnectedPlaybackControlProps extends PlaybackControlProps {
    progressMinutes: string,
    progressSeconds: string,
    durationMinutes: string,
    durationSeconds: string
    progress: number,
    
    isPlaying: boolean

    play: () => void,
    pause: () => void,
    rewindToStart: () => void
}

export const PlaybackControl = (props: ConnectedPlaybackControlProps): JSX.Element => (
    <div className={props.className}>
        <IconButton onClick={() => props.rewindToStart()}>
            <FirstPage/>
        </IconButton>
        <IconButton onClick={() => props.isPlaying ? props.pause() : props.play()}>
            { props.isPlaying ? <Pause/> : <PlayArrow/> }
        </IconButton>
        <Typography variant='body1' classes={{root: Classes.progressGadgetText}}>
            {props.progressMinutes}:{props.progressSeconds}/{props.durationMinutes}:{props.durationSeconds}
        </Typography>
    </div>
)

export default PlaybackControl