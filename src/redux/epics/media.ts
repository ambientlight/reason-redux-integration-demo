import * as fs from 'fs'
import { Observable } from 'rxjs/Observable'
import { map, mergeMap, takeWhile, catchError, first, tap } from 'rxjs/operators'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/concat'
import 'rxjs/add/observable/merge'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/timer'
import 'rxjs/add/observable/throw'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/interval'
import { combineEpics, ActionsObservable } from 'redux-observable'
import { Action } from 'redux'

import * as Actions from '../actions'
import * as State from '../state'
import { storeDescriptor } from '../store'


const loadSourceFromFile = (filePath: string, videoElement: HTMLVideoElement): Observable<{ duration: number, objectUrl: string }> => new Observable(subscriber =>
    fs.readFile(filePath, (error, data) => {
        const blob = new Blob([data], { type: 'video/mp4'})
        const objectUrl = URL.createObjectURL(blob)      
        videoElement.onloadeddata = event => {
            subscriber.next({ duration: videoElement.duration, objectUrl })
            subscriber.complete()
        }

        videoElement.onerror = errorEvent => { 
            console.log('got error on loading from object url')
            subscriber.error(errorEvent) 
        }

        videoElement.src = objectUrl
    })
)


const loadSourceFromObjectUrl = (objectUrl: string, videoElement: HTMLVideoElement): Observable<{ duration: number, objectUrl: string }> => new Observable(subscriber => {
    videoElement.onloadeddata = event => {
        subscriber.next({ duration: videoElement.duration, objectUrl })
        subscriber.complete()
    }

    videoElement.onerror = errorEvent => { 
        console.log('got error on loading from object url')
        subscriber.error(errorEvent) 
    }

    videoElement.src = objectUrl
})

const loadSource = (action$: ActionsObservable<Action>, store: { value: State.Root }): Observable<Actions.Media.LoadSourceDoneAction | Actions.Media.LoadSourceErrorAction> =>
    action$.ofType(Actions.Media.ActionType.loadSource).pipe(
        mergeMap((action: Actions.Media.LoadSourceAction) => {
            const videoNode = window.document.getElementById(action.elementId) as HTMLVideoElement
            if(!videoNode){
                console.warn(`Element with id:${action.elementId} not found`)
                return Observable.empty()
            }

            return (() => { switch(action.sourceType){
                case 'file': return loadSourceFromFile(action.sourceIdentifier, videoNode)
            }})().pipe(
                mergeMap(({ duration, objectUrl }) => {
                    videoNode.currentTime = store.value.media.progress;
                    return Observable.fromEvent(videoNode, 'seeked').pipe(
                        first(), 
                        map(() => Actions.Media.loadSourceDone(action, duration, objectUrl))
                    )
                }),
                catchError(error => Observable.of(Actions.Media.loadSourceError(action, error)))
            )
        })
    )

const play = (action$: ActionsObservable<Action>, store: { value: State.Root }) => 
    action$.ofType(Actions.Media.ActionType.play).pipe(
        mergeMap((action: Actions.Media.PlayAction): Observable<Actions.Media.PlayErrorAction | Actions.Media.PlayDoneAction | Actions.Media.ProgressUpdateAction | Actions.Media.PlaybackEndedAction> => {
            const elementId = store.value.media.elementId
            if(!elementId){
                console.warn('Media is not loaded. Playback is not performed.')
                return Observable.of(Actions.Media.playError('media is not loaded'))
            }

            const videoNode = window.document.getElementById(elementId) as HTMLVideoElement
            const playbackEndedObservable = Observable.fromEvent(videoNode, 'ended').pipe(
                first(),
                mergeMap(event => Observable.concat(
                    Observable.of(Actions.Media.progressUpdate(videoNode.currentTime)),
                    Observable.of(Actions.Media.playbackEnded())
                ))
            );

            // store persisting the state changes during playback
            (storeDescriptor.persistor as any).pause()

            videoNode.play()
            return Observable.concat(
                Observable.of(Actions.Media.playDone()),
                Observable.timer(0, 1000 / store.value.media.captureFrameRate).pipe(
                    mergeMap(() => Observable.of(Actions.Media.progressUpdate(videoNode.currentTime)).pipe(
                        takeWhile(observable => store.value.media.state == 'playing')
                ))),
                // playback end will result in media.state change which will complete the observable above
                playbackEndedObservable
            )
        })
    )

const pause = (action$: ActionsObservable<Action>, store: { value: State.Root }) => 
    action$.ofType(Actions.Media.ActionType.pause).pipe(
        mergeMap((action: Actions.Media.PauseAction): Observable<Actions.Media.ProgressUpdateAction | Actions.Media.PauseDoneAction | Actions.Media.PauseErrorAction> => {
            const elementId = store.value.media.elementId
            if(!elementId){
                console.warn('Media is not loaded. Pause is not performed.')
                return Observable.of(Actions.Media.pauseError('media is not loaded'))
            }
            
            // continue state persistence after playback is complete
            (storeDescriptor.persistor as any).persist()

            const videoNode = window.document.getElementById(elementId) as HTMLVideoElement
            videoNode.pause()
            
            const frameIndex = Math.round(store.value.media.captureFrameRate * videoNode.currentTime)
            videoNode.currentTime = frameIndex * (1 / store.value.media.captureFrameRate)
            return Observable.fromEvent(videoNode, 'seeked').pipe(
                first(), 
                mergeMap(() => Observable.concat(
                    Observable.of(Actions.Media.progressUpdate(videoNode.currentTime)),
                    Observable.of(Actions.Media.pauseDone())
                )
            ))            
        })
    )

const rewindToStart = (action$: ActionsObservable<Action>, store: { value: State.Root }) =>
    action$.ofType(Actions.Media.ActionType.rewindToStart).pipe(
        mergeMap((action: Actions.Media.RewindToStartAction): Observable<Actions.Media.RewindToStartErrorAction | Actions.Media.RewindToStartDoneAction | Actions.Media.PauseAction | Actions.Media.ProgressUpdateAction> => {
            const elementId = store.value.media.elementId
            if(!elementId){
                console.warn('Media is not loaded. Pause is not performed.')
                return Observable.of(Actions.Media.rewindToStartError('media is not loaded'))
            }

            const videoNode = window.document.getElementById(elementId) as HTMLVideoElement
            videoNode.currentTime = 0
            return Observable.fromEvent(videoNode, 'seeked').pipe(
                first(), 
                mergeMap(() => Observable.concat(
                    Observable.of(Actions.Media.progressUpdate(videoNode.currentTime)),
                    Observable.of(Actions.Media.rewindToStartDone())
                )
            ))
        })
    )

const reloadSourceIfNeeded = (action$: ActionsObservable<Action>, store: { value: State.Root }) =>
    action$.ofType(Actions.Media.ActionType.reloadSourceIfNeeded).pipe(
        mergeMap((action: Action) => {
            const elementId = store.value.media.elementId
            const sourceIdentifier = store.value.media.sourceIdentifier
            if(!elementId || !sourceIdentifier){ return Observable.empty() }

            const videoNode = window.document.getElementById(elementId) as HTMLVideoElement
            if(!videoNode){
                console.warn(`Element with id:${elementId} not found`)
                return Observable.empty()
            }

            return Observable.concat(
                Observable.of(Actions.Media.reloadSourceStarted()), 
                (store.value.media.objectUrl 
                    ? loadSourceFromObjectUrl(store.value.media.objectUrl, videoNode) 
                    : loadSourceFromFile(sourceIdentifier, videoNode)
                ).pipe(
                    mergeMap(({ duration, objectUrl })=> {
                        videoNode.currentTime = store.value.media.progress
                        // turn loaded emission into pause so if reload happened during play, state will update accordingly
                        // alternatively we could turn emission into Actions.Media.loadSourceDone as in standard load
                        return Observable.concat(
                            Observable.of(Actions.Media.reloadSourceDone(objectUrl)), 
                            Observable.of(Actions.Media.pause()))
                    })
                )
            )
        })
    )

const removeResource = (action$: ActionsObservable<Action>, store: { value: State.Root }) => 
    action$.ofType(Actions.Media.ActionType.removeResource).pipe(
        mergeMap((action: Action) => {
            const elementId = store.value.media.elementId
            const sourceIdentifier = store.value.media.sourceIdentifier
            if(!elementId || !sourceIdentifier){ return Observable.empty() }

            const videoNode = window.document.getElementById(elementId) as HTMLVideoElement
            if(!videoNode){
                console.warn(`Element with id:${elementId} not found`)
                return Observable.empty()
            }

            videoNode.pause()
            videoNode.src = ""
            videoNode.load()
            return Observable.of(Actions.Media.removeResourceDone())
        })
    )

export const mediaEpics = combineEpics(
    loadSource,
    reloadSourceIfNeeded,
    removeResource,

    play,
    pause,
    rewindToStart
)