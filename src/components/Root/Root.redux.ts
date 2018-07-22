import { desktopCapturer, remote, Dialog } from 'electron'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as State from '../../redux/state'
import * as Actions from '../../redux/actions'
import { Root, RootProps, VIDEO_CONTEXT_ELEMENT_ID } from './Root'

const mapStateToProps = (state: State.Root, props: RootProps) => ({
    isMediaLoading: state.media.state == State.MediaState.Loading,
    resourceListVisible: state.resourceList.visible
})

const mapDispatchToProps = (dispatch: Dispatch, props: RootProps) => ({
    loadFromFile: () => remote.dialog.showOpenDialog({ properties: [ 'openFile' ] }, files => {
        if(!files || files.length == 0){ return }
        dispatch(Actions.Media.loadVideoSourceFromFile(files[0], VIDEO_CONTEXT_ELEMENT_ID))
    }),

    reloadSourceIfNeeded: () => { dispatch(Actions.Media.reloadSourceIfNeeded()) },

    toogleResourceListVisibility: (visibility: string) => {
        dispatch({
            type: 'set_resource_list_visibility',
            visibility
        })
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Root as any)