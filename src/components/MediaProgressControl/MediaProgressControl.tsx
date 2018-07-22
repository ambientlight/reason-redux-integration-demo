import * as React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'

import { StyledThemedProps } from '../../utils'
import { PlaybackControl } from './controls'
import FilenameLabel from '../FilenameLabel/FilenameLabel.redux'

export const Classes = {
    linearProgress: 'linear-progress',
    progressGadgetContainer: 'progress-gadget-container',
    progressGadgetText: 'progress-gadget-text'
}

export interface MediaProgressControlProps extends StyledThemedProps {}
export interface ConnectedMediaProgressControlProps extends MediaProgressControlProps {
    progressPercentage: number,
    canPlay: boolean
}

export const MediaProgressControl = (props: ConnectedMediaProgressControlProps): JSX.Element => (
    <div className={props.className}>
        <LinearProgress color='secondary' classes={{root: Classes.linearProgress}} variant="determinate" value={props.progressPercentage * 100} />
        <div className={Classes.progressGadgetContainer} style={{
            opacity: props.canPlay ? 1.0 : 0.5,
            pointerEvents: props.canPlay ? 'initial' : 'none'
        }}>
            <PlaybackControl/>
            <FilenameLabel/>
        </div>
    </div>
)

export default MediaProgressControl