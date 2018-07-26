import * as State from '../state'
import * as Actions from '../actions'
import { initial, MediaState } from '../state/media'

export const media = (lastState: State.Media = initial(), action: Actions.Media.Action): State.Media => {
    switch(action.type){
        case Actions.Media.ActionType.loadSource:
            return { 
                ...lastState,
                state: MediaState.Loading
            }
        case Actions.Media.ActionType.loadSourceDone:
            return {
                ...lastState,
                elementId: action.elementId,
                sourceIdentifier: action.sourceIdentifier,
                duration: action.duration || 0,
                state: MediaState.NotPlaying,
                objectUrl: action.objectURL
            }
        case Actions.Media.ActionType.playDone:
            return { ...lastState, state: MediaState.Playing }
        case Actions.Media.ActionType.pauseDone:
            // don't set into notPlaying state unless we are currently playing
            // this is relevant since pauseDone can be called in other cases 
            // (like hot reload to have a state consistent: when isPlaying was set in the moment hot reload occured)

            return { ...lastState, state: lastState.state == MediaState.Playing ? MediaState.NotPlaying : lastState.state }
        case Actions.Media.ActionType.playbackEnded:
            return { ...lastState, state: MediaState.NotPlaying }
        case Actions.Media.ActionType.progressUpdate:
            return { 
                ...lastState, 
                progress: action.progress, frameSampleIndex: Math.round(lastState.captureFrameRate * action.progress) 
            }
        case Actions.Media.ActionType.reloadSourceStarted:
            return { ...lastState, isMediaReloading: true }
        case Actions.Media.ActionType.reloadSourceDone:
            return { 
                ...lastState, 
                isMediaReloading: false,
                objectUrl: action.objectURL
            }

        case Actions.Media.ActionType.removeResourceDone:
            return initial()
            
        default:
            return lastState
    }
}