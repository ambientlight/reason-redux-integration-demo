import * as MediaState from './media'
const ResourceListState = require('reason/redux/state/resourceListState.bs').initial

export interface Root {
    media: MediaState.Media,
    // definition of our reason substate
    resourceList: {
        resourcePaths: string[],
        visible: boolean
    }
}

export const initial: () => Root = () => ({
    media: MediaState.initial(),
    resourceList: ResourceListState.initial()
})


