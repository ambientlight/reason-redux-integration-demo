import { remote, Dialog } from 'electron'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as State from '../../redux/state'
import * as Actions from '../../redux/actions'
import { MediaProgressControl, MediaProgressControlProps } from './MediaProgressControl'

const mapStateToProps = (state: State.Root, props: MediaProgressControlProps) => ({
    progressPercentage: state.media.progress / state.media.duration,
    canPlay: state.media.state != State.MediaState.Loading && state.media.state != State.MediaState.NotLoaded
})

const mapDispatchToProps = (dispatch: Dispatch, props: MediaProgressControlProps) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MediaProgressControl)
