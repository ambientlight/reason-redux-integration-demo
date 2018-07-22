/* bs definition of the state portion we want to access */

[@bs.deriving abstract]
type media = {
    sourceIdentifier: Js.Nullable.t(string)
};

[@bs.deriving abstract]
type root = {
    resourceList: ResourceListState.state,
    media: media
};