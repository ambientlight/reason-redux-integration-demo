import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as State from '../../redux/state'
import { StyledProps } from '../../utils';

const FilenameLabel = require('reason/components/FilenameLabel/FilenameLabel.bs.js').jsComponent

interface FilenameLabelProps extends StyledProps {}

const mapStateToProps = (state: State.Root, props: FilenameLabelProps) => ({
    filename: state.media.sourceIdentifier ? state.media.sourceIdentifier.split('/').pop() : undefined
})

const mapDispatchToProps = (dispatch: Dispatch, props: FilenameLabelProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(FilenameLabel)