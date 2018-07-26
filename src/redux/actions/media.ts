import { Action } from 'redux'

export enum ActionType {
    loadSource = 'load_source',
    loadSourceDone = 'load_source_done',
    loadSourceError = 'load_source_error',
    
    play = 'play',
    playDone = 'play_done',
    playError = 'play_error',

    pause = 'pause',
    pauseError = 'pause_error',
    pauseDone = 'pause_done',

    rewindToStart = 'rewind_to_start',
    rewindToStartDone = 'rewind_to_start_done',
    rewindToStartError = 'rewind_to_start_error',

    reloadSourceIfNeeded = 'reload_source_if_needed',
    reloadSourceStarted = 'reload_source_started',
    reloadSourceDone = 'reload_source_done',

    progressUpdate = 'playback_progress_update',
    playbackEnded = 'playback_ended',

    // for resourceListAction.RemoveResource(string)
    removeResource = 'remove_resource',
    removeResourceDone = 'remove_resource_done'
}

export type Action = LoadSourceAction | LoadSourceDoneAction | PlayAction | PauseAction | PlaybackEndedAction | RewindToStartAction /* | SkipToEndAction */ | ProgressUpdateAction  | PlayDoneAction | PlayErrorAction | PauseDoneAction | PauseErrorAction | RewindToStartDoneAction | RewindToStartErrorAction | ReloadSourceStartedAction | ReloadSourceDoneAction | RemoveResourceAction | RemoveResourceDoneAction

interface _LoadSourceBase extends Action {
    // file, realtime-stream etc..
    sourceType: 'file'

    // file path or chrome media source id
    sourceIdentifier: string

    // target element id displaying video content
    elementId: string
}

export interface LoadSourceAction extends _LoadSourceBase {
    type: ActionType.loadSource
}

export interface LoadSourceDoneAction extends _LoadSourceBase {
    type: ActionType.loadSourceDone,
    duration: number | null,
    objectURL: string
}

export interface LoadSourceErrorAction extends _LoadSourceBase {
    type: ActionType.loadSourceError,
    error: string
}

export interface PlayAction extends Action { type: ActionType.play }
export interface PlayDoneAction extends Action { type: ActionType.playDone }
export interface PlayErrorAction extends Action { type: ActionType.playError, error: any }
export interface PauseAction extends Action { type: ActionType.pause }
export interface PauseDoneAction extends Action { type: ActionType.pauseDone }
export interface PauseErrorAction extends Action { type: ActionType.pauseError, error: any }
export interface PlaybackEndedAction extends Action { type: ActionType.playbackEnded }
export interface RewindToStartAction extends Action { type: ActionType.rewindToStart }
export interface RewindToStartDoneAction extends Action { type: ActionType.rewindToStartDone }
export interface RewindToStartErrorAction extends Action { type: ActionType.rewindToStartError, error: any }
export interface ReloadSourceIfNeededAction extends Action { type: ActionType.reloadSourceIfNeeded }
export interface ReloadSourceStartedAction extends Action { type: ActionType.reloadSourceStarted }
export interface ReloadSourceDoneAction extends Action { 
    type: ActionType.reloadSourceDone,
    objectURL: string
}

export interface ProgressUpdateAction extends Action {
    type: ActionType.progressUpdate,
    progress: number
}

// for resourceListAction.RemoveResource(string)
export interface RemoveResourceAction extends Action {
    type: ActionType.removeResource,
    resourcePath: string
}
export interface RemoveResourceDoneAction extends Action { type: ActionType.removeResourceDone }

export const loadVideoSourceFromFile = (filePath: string, elementId: string): LoadSourceAction => ({
    type: ActionType.loadSource,
    sourceType: 'file',
    sourceIdentifier: filePath,
    elementId: elementId
})

export const loadSourceDone = (loadSourceAction: LoadSourceAction, duration: number | null, objectURL: string): LoadSourceDoneAction => ({ 
    ...loadSourceAction,
    type: ActionType.loadSourceDone,
    duration: duration,
    objectURL
})

export const loadSourceError = (loadSourceAction: LoadSourceAction, error: string): LoadSourceErrorAction => ({
    ...loadSourceAction,
    type: ActionType.loadSourceError,
    error: error
})

export const reloadSourceIfNeeded = (): ReloadSourceIfNeededAction => ({ type: ActionType.reloadSourceIfNeeded })
export const reloadSourceStarted = (): ReloadSourceStartedAction => ({ type: ActionType.reloadSourceStarted })
export const reloadSourceDone = (objectURL: string): ReloadSourceDoneAction => ({ 
    type: ActionType.reloadSourceDone, 
    objectURL 
}) 

export const play = (): PlayAction => ({ type: ActionType.play })
export const playDone = (): PlayDoneAction => ({ type: ActionType.playDone })
export const playError = (error: any): PlayErrorAction => ({ type: ActionType.playError, error })
export const pause = (): PauseAction => ({ type: ActionType.pause })
export const pauseDone = (): PauseDoneAction => ({ type: ActionType.pauseDone })
export const pauseError = (error: any): PauseErrorAction => ({ type: ActionType.pauseError, error })
export const playbackEnded = (): PlaybackEndedAction => ({ type: ActionType.playbackEnded })
export const rewindToStart = (): RewindToStartAction => ({ type: ActionType.rewindToStart })
export const rewindToStartDone = (): RewindToStartDoneAction => ({ type: ActionType.rewindToStartDone })
export const rewindToStartError = (error: any): RewindToStartErrorAction => ({ type: ActionType.rewindToStartError, error })

export const progressUpdate = (progress: number): ProgressUpdateAction => ({ 
    type: ActionType.progressUpdate,
    progress: progress
})

export const removeResource = (resourcePath: string): RemoveResourceAction => ({ 
    type: ActionType.removeResource,  
    resourcePath
})
export const removeResourceDone = (): RemoveResourceDoneAction => ({ type: ActionType.removeResourceDone })