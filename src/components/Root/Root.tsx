import * as React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { VideoLibrary, List, Videocam } from '@material-ui/icons'

import MediaProgressControl from '../MediaProgressControl/MediaProgressControl.styled'
import ReasourceList from '../ResourceList/ResourceList.styled'
import LoadingDialog from '../dialogs/LoadingDialog'
import { StyledThemedProps, ThemedProps, Mounted } from '../../utils'

export const VIDEO_CONTEXT_ELEMENT_ID = 'video-context-main'

export interface RootProps extends StyledThemedProps {}

interface ConnectedRootProps extends RootProps {
    isMediaLoading: boolean
    resourceListVisible: boolean

    loadFromFile: () => void
    reloadSourceIfNeeded: () => void
    toogleResourceListVisibility: (visibility: boolean) => void
}

export const Classes = {
    scene: 'scene',
    toolbar: 'toolbar'
}

const VideoContext = Mounted((props) => (
    <video id={VIDEO_CONTEXT_ELEMENT_ID}></video>
))

export const Root = (props: ConnectedRootProps): JSX.Element => (
    <div className={props.className}>
        <div className={Classes.toolbar}>
            <Tooltip title="Add video resource" placement="right">
                <IconButton 
                    aria-label="Add video resource" 
                    onClick={() => props.loadFromFile()}>

                    <VideoLibrary />
                </IconButton>
            </Tooltip>
            <Tooltip title="Recent videos" placement="right">
                <IconButton 
                    aria-label="Recent videos" 
                    onClick={() => props.toogleResourceListVisibility(!props.resourceListVisible)}>
                    
                    <List/>
                </IconButton>
            </Tooltip>
        </div>
        { props.resourceListVisible 
            ? <ReasourceList/> 
            : <></> 
        }

        <div className={Classes.scene}>
            <VideoContext didMount={props.reloadSourceIfNeeded}/>
            <MediaProgressControl/>
        </div>

        <LoadingDialog open={props.isMediaLoading}/>
    </div>
)

export default Root