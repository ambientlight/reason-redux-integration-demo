export enum MediaState {
    NotLoaded = 'not-loaded',
    Loading = 'loading',
    NotPlaying = 'not-playing',
    Playing = 'playing'
}

export interface Media {
    state: MediaState,
    // small hack to not touch a state(not setting to Loading) above during hot-reload
    // but still store loading state to show the progress
    isMediaReloading: boolean

    // file path or chrome media source id
    sourceIdentifier: string | null

    // target element id displaying video content    
    elementId: string | null

    // fps for sampling
    captureFrameRate: number

    // progress milliseconds
    progress: number

    // media duration
    duration: number,

    frameSampleIndex: number
}

export const initial: () => Media = () => ({
    state: MediaState.NotLoaded,
    isMediaReloading: false,
    sourceIdentifier: null,
    elementId: null,
    captureFrameRate: 10,
    progress: 0,
    duration: 0,

    frameSampleIndex: 0
})