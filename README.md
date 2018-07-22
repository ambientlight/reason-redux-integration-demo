## reason-redux-integration-demo
Example that demonstrates integration of [reason](https://reasonml.github.io) into real-world pure [react](https://reactjs.org)-[redux](https://redux.js.org) app ([electron](https://electronjs.org)) build on following stack:

* [webpack](https://webpack.js.org)
* [typescript](https://www.typescriptlang.org)
* [redux-observable](https://redux-observable.js.org) (middleware)
* [material-ui](https://material-ui.com)
* [styled-components](https://www.styled-components.com) (css-in-js)

App is a minimal electron video player with reason used to implement [Recent Videos](src/components/ResourceList/ResourceList.re) component.

![](readme_assets/sample.png)

## Getting started

1. `npm install -g reason-cli@3.2.0-darwin bs-platform`
2. make sure you've installed [OCaml and Reason IDE extension](https://marketplace.visualstudio.com/items?itemName=freebroccolo.reasonml) for vscode or find one for your editor of choice: [Editor Plugins](https://reasonml.github.io/docs/en/editor-plugins)
3. `npm install`
4. `npm run bsb` for incremental builds of your reason code (or `Cmd+Shift+b` -> `b` -> `enter` in vscode)
5. `npm run dev` to launch webpack-dev-server with hot-reload (or `Cmd+Shift+b` -> `w` -> `enter` in vscode)
6. `npm run electron` to launch app. (or F5 in vscode)


## Approach 1: Light-weight
A simple and reasonable approach is [wrap our reason component](https://reasonml.github.io/reason-react/docs/en/interop#reactjs-using-reasonreact) and pass it to `react-redux` [connect](https://redux.js.org/basics/usage-with-react#containers-filterlink-js) on .js/ts side. This way we only write component part in reason and our redux logic stays in js/ts. Seems ideal while getting started with reason.

[FilenameLabel.re](src/components/FilenameLabel/FilenameLabel.re)

```reason
let component = ReasonReact.statelessComponent("FilenameLabel");

let make = (~filename, ~className, _children) => {
    ...component,
    render: _self =>
        <span className style=(ReactDOMRe.Style.make(
            ~color="white", 
            ~fontFamily="Roboto, \"Helvetica Neue\", sans-serif",
            ~fontSize="13px",
            ()
        ))>
            (ReasonReact.string(filename))
        </span>,
};

[@bs.deriving abstract]
type jsProps = {
    filename: option(string),
    className: string
};

let jsComponent = ReasonReact.wrapReasonForJs(~component, jsProps => make(
    ~className = jsProps |. classNameGet,
    ~filename = jsProps |. filenameGet |> Js.Option.getWithDefault("nothing loaded"),
    [||],
));
```

[FilenameLabel.redux.ts](src/components/FilenameLabel/FilenameLabel.redux.ts)

```ts
const FilenameLabel = require('reason/components/FilenameLabel/FilenameLabel.bs.js').jsComponent

interface FilenameLabelProps extends StyledProps {}

const mapStateToProps = (state: State.Root, props: FilenameLabelProps) => ({
    filename: state.media.sourceIdentifier ? state.media.sourceIdentifier.split('/').pop() : undefined
})
const mapDispatchToProps = (dispatch: Dispatch, props: FilenameLabelProps) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(FilenameLabel)
```

## Approach 2: Redux substate logic 100% in reason

### Action Creators
Common way to define a set of related actions involves utilizing typescript's tagged union ([discriminated union](https://github.com/basarat/typescript-book/blob/master/docs/types/discriminated-unions.md)):

```ts
export enum ActionType {
	 play = 'play',
	 pause = 'pause'
}

export type MediaAction = PlayAction | PauseAction
export interface PlayAction extends Action { 
	type: ActionType.play,
	id: string
}
export interface PauseAction extends Action { 
	type: ActionType.pause 
	id: string
}
```

Discriminated union (a.k.a. [variant](https://reasonml.github.io/docs/en/variant.html)) is a build-in data structure in reason, and thus we can model the above thing as:

```reason
type mediaAction = 
  | Play(string)
  | Pause(string);
```

Alright, but now we want that our `mediaAction` actually maps to the above thing, so we can handle these actions in our existing reducers on js/ts side and debug in [redux-dev-tools](https://github.com/zalmoxisus/redux-devtools-extension), but since for now [bucklescript](https://bucklescript.github.io) (ocalm-to-js compiler) cannot directly map variants to js-objects, we need to do the conversion ourselves. We utilize [glennsl/bs-json](https://github.com/glennsl/bs-json) for this purpose ([resourceListAction.re](src/redux/actions/resourceListAction.re)):

```reason
type mediaAction = 
  | Play(string)
  | Pause(string);

module Decode = {
  open Json.Decode;

  let mediAction = json => switch(json |> field("type", string)){
  | "play" => Some(Play(
    json |> field("id", string)))
  | "pause" => Some(Pause(
    json |> field("id", string)))
  | _ => None
  }
}

module Encode = {
  open Json.Encode;

  let mediaAction = action => switch(action){
  | Play(id) => object_([
    ("type", string("play")),
    ("id", string(id))])
  | Pause(id) => object_([
    ("type", string("play")),
    ("id", string(id))])
  }
}

let toJs = action => action |> Encode.mediaAction;
let fromJs = js => js |> Decode.mediAction;
```

And thus we can then dispatch actions like:

```reason
dispatch(Play("my_media.mov") |> toJs)
```

### Substate

Utilize `[bs.deriving abstract]` ([resourceListState.re](src/redux/state/resourceListState.re)).

```reason
[@bs.deriving abstract]
type state = {
    resourcePaths: list(string),
    visible: bool
};

let initial = () => state(
    ~resourcePaths=[],
    ~visible=false
);
```

Add it to our root state as any other substate, providing type definitions ([root.ts](src/redux/state/root.ts)):

```ts
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
```

### Reducer

Same as our js/ts reducer, though we need to convert action back to variant ([resourceListReducer.re](src/redux/reducers/resourceListReducer.re)):

```reason
open List
open ResourceListState
open ResourceListAction

let reducer = (~lastState=initial(), ~action: Js.Json.t) => 
  switch(action |> ResourceListAction.fromJs){
  | None => lastState
  
  | Some(LoadSourceDone(_sourceType, sourceIdentifier, _elementId, _duration)) => 
    mem(sourceIdentifier, lastState|.resourcePathsGet) 
      ? lastState
      : state(
          ~resourcePaths=[sourceIdentifier, ...(lastState|.resourcePathsGet)],
          ~visible=lastState|.visibleGet
        )

  | Some(RemoveResource(resourcePath)) => 
    state(
      ~resourcePaths=filter(res => res != resourcePath, lastState|.resourcePathsGet),
      ~visible=lastState|.visibleGet
    )
    
  | Some(SetVisibility(visible)) => 
    state(
      ~resourcePaths=lastState|.resourcePathsGet,
      ~visible=visible
    )
  | _ => lastState
  };
```

Add it to our root reducer as any other substate reducer ([root.ts](src/redux/reducers/root.ts)):

```ts
import { combineReducers } from 'redux'
import * as State from '../state'
import { media } from './media'
const resourceList = require('reason/redux/reducers/resourceListReducer.bs').reducer

export const root = combineReducers<State.Root>({
    media,
    resourceList
})
```

### Component
On reason side we now can call `connect`, given that we have added the `react-redux` [bucklescript binding](src/bs-bindings/ReactRedux.re):

```reason
type mapStateToProps('state, 'props, 'connectedStateProps) = (. 'state, 'props) => 'connectedStateProps;
type mapDispatchToProps('action, 'props, 'connectedDispatchProps) = (. (. 'action) => unit, 'props) => 'connectedDispatchProps;

[@bs.module "react-redux"] 
external connect: (
  mapStateToProps('state, 'props, 'connectedStateProps), 
  mapDispatchToProps('action, 'props, 'connectedDispatchProps)
) => (. ReasonReact.reactClass) => ReasonReact.reactClass = "connect";
```

We also need to provide type definitions for the partial state that we want our reason code to access ([rootState.re](src/redux/state/rootState.re)):

```reason
[@bs.deriving abstract]
type media = {
    sourceIdentifier: Js.Nullable.t(string)
};

[@bs.deriving abstract]
type root = {
    resourceList: ResourceListState.state,
    media: media
};
```

And thus in our reason component ([ResourceList.re](src/components/ResourceList/ResourceList.re)):

```reason
[@bs.deriving abstract]
type stateProps = {
  resourcePaths: list(string),
  selectedResourcePath: option(string)
};

[@bs.deriving abstract]
type dispatchProps = {
  selectResource: string => unit,
  loadFromFile: unit => unit,
  removeResource: string => unit
};

let connectedComponent = ReactRedux.connect(
  (. state: RootState.root, ()) => stateProps(
    ~resourcePaths=state |. RootState.resourceListGet |. ResourceListState.resourcePathsGet,
    ~selectedResourcePath=(state |. RootState.mediaGet |. RootState.sourceIdentifierGet) |> Js.Nullable.toOption
  ),
  (. dispatch, ()) => dispatchProps(
    ~selectResource=(resourcePath => 
      dispatch(. LoadSourceFromFile("file", resourcePath, "video-context-main") |> toJs )
    ),
    ~loadFromFile=(() => Electron.showOpenDialog([`OpenFile], filePaths => 
      length(filePaths) > 0 ?
        dispatch(. LoadSourceFromFile("file", hd(filePaths), "video-context-main") |> toJs )
        : ()
    )),
    ~removeResource=(resourcePath => 
      dispatch(. RemoveResource(resourcePath) |> toJs)
    )
  )
)(. jsComponent)
```

## Notes
### Bindings
Material-UI bindings have been generated via [reason-mui-binding-generator](https://github.com/jsiebern/reason-mui-binding-generator).

### Reason integration
(1) `npm install -g reason-cli@3.2.0-darwin`  
(2) install OCaml and Reason IDE extension in vscode  
(3) install node dependencies:

```
// used as a dependency in emited .sj 
npm install --g bs-platform
npm install --save reason-react
```
(4) Then place a **bsconfig.json** into root:

```json
{
  "name": "react-template",
  "reason": {
    "react-jsx": 2
  },
  "sources": {
    "dir" : "src",
    "subdirs" : true
  },
  "package-specs": [{
    "module": "commonjs",
    "in-source": false
  }],
  "suffix": ".bs.js",
  "namespace": true,
  "bs-dependencies": [
    "reason-react"
  ],
  "refmt": 3
}
```
(5) Add some reason source file and compile it with `bsb -make-world`  
(6) Since we have specified `"in-source": false` in the above config, all compilation output will go to `lib/js` folder. Add aliases to `webpack.config.babel.js` and `tsconfig.json` so we can easier reference the compiled reason code in js and js code in reason:

in your `webpack.config.babel.js`:

```js
{
  // webpack config
  resolve: {
    alias: {
      reason: path.resolve(__dirname, "lib/js/src"),
      src: path.resolve(__dirname, "src")
    }
  }
}
```

in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "reason": ["lib/js/src"],
      "src": ["src"]
     }
   }
}
```

And then we can import reason compiled output like:

```
const FilenameLabel = require('reason/components/FilenameLabel/FilenameLabel.bs.js').jsComponent
```

**Alternatively**, if you don't really mind poluting your source folder with bucklescript compiled .js files, you can set `"in-source": true`, which will have compiled output available alongside your source so relative import can be used:

```
const FilenameLabel = require('./FilenameLabel.bs.js').jsComponent
```
