import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as State from '../../../../redux/state'
import * as Actions from '../../../../redux/actions'
import { PlaybackControl, PlaybackControlProps } from './PlaybackControl'

const secondsToMinuteSecondsStrings = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds - 60 * minutes)
    const minutesStr = minutes.toFixed()
    const remainingSecondsStr = remainingSeconds.toFixed()

    return {
        minutes: minutesStr.length > 1 ? `${minutes}` : `0${minutesStr}`,
        seconds: remainingSecondsStr.length > 1 ? `${remainingSecondsStr}` : `0${remainingSecondsStr}`
    }
}

const mapStateToProps = (state: State.Root, props: PlaybackControlProps) => ({
    progressMinutes: secondsToMinuteSecondsStrings(state.media.progress).minutes,
    progressSeconds: secondsToMinuteSecondsStrings(state.media.progress).seconds,
    durationMinutes: secondsToMinuteSecondsStrings(state.media.duration).minutes,
    durationSeconds: secondsToMinuteSecondsStrings(state.media.duration).seconds,
    progress: state.media.progress,

    isPlaying: state.media.state == State.MediaState.Playing
})


const mapDispatchToProps = (dispatch: Dispatch, props: PlaybackControlProps) => ({
    play: () => { dispatch(Actions.Media.play()) },
    pause: () => { dispatch(Actions.Media.pause()) },
    rewindToStart: () => { dispatch(Actions.Media.rewindToStart()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackControl)