open List
open MaterialUi
open MaterialUiIcons

open ResourceListAction

/* flex:1 for convenience */
module FlexFillingSpace {
  [@bs.module "src/styled/FlexTools"]
  external reactClass : ReasonReact.reactClass = "FlexFillingSpace";
  let make = children =>
    ReasonReact.wrapJsForReason(~reactClass, ~props=Js.Obj.empty(), children);
};

let component = ReasonReact.statelessComponent("ResourceList");

[@bs.deriving abstract]
type cssClasses = {
  header: string,
  element: string,
  elementName: string,
  addVideoButton: string,
  placeholder: string,
  removeButton: string
};

let classNames = cssClasses(
  ~header="resource-list-header",
  ~element="resource-element",
  ~elementName="resource-element-name",
  ~addVideoButton="add-video-button",
  ~placeholder="placeholder",
  ~removeButton="remove-button"
);

let make = (~className, ~resourcePaths: list(string), ~selectedResourcePath, ~selectResource, ~loadFromFile, ~removeResource, _children) => {
  ...component,
  render: _self => 
    <div className>
      <Typography variant=`Body2 classes=[Typography.Classes.Root(classNames|.headerGet)]>
        (ReasonReact.string("RECENT VIDEOS"))
      </Typography>

      (length(resourcePaths) == 0 
        ? <Typography variant=`Caption classes=[Typography.Classes.Root(classNames|.placeholderGet)]>
            (ReasonReact.string("Nothing here yet."))
            <br/>
            (ReasonReact.string("Start by adding a new video."))
          </Typography> 
        : <Fragment>
            (resourcePaths |> map(res => 

                <div key=res 
                  className=((classNames|.elementGet) ++ ((selectedResourcePath |> Js.Option.getWithDefault("")) == res ? " selected" : ""))
                  onClick=((_event) => (selectedResourcePath |> Js.Option.getWithDefault("")) != res ? selectResource(res) : ())>
                    <Videocam/>
                    <Typography variant=`Caption classes=[Typography.Classes.Root(classNames|.elementNameGet)]>
                        (ReasonReact.string(
                          res 
                          |> Js.String.split("/") 
                          |> Js.Array.pop 
                          |> Js.Option.getWithDefault("")))
                    </Typography>

                    <FlexFillingSpace/>

                    <IconButton 
                      classes=[IconButton.Classes.Root(classNames|.removeButtonGet)]
                      onClick=((_event) => removeResource(res))>
                        <Close/>
                    </IconButton>
                </div>

            ) |> Array.of_list |> ReasonReact.array)
          </Fragment>
        )
        
        <Button color=`Secondary classes=[Button.Classes.Root(classNames|.addVideoButtonGet)] onClick=(_event => loadFromFile())>
            (ReasonReact.string("Add video resource"))
        </Button>
    </div>
};

[@bs.deriving abstract]
type jsComponentProps = {
    className: string,
    resourcePaths: list(string),
    selectedResourcePath: option(string),
    selectResource: string => unit,
    loadFromFile: unit => unit,
    removeResource: string => unit
}

let jsComponent = ReasonReact.wrapReasonForJs(~component, jsProps => make(
    ~className=jsProps |. classNameGet,
    ~resourcePaths=jsProps |. resourcePathsGet,
    ~selectedResourcePath=jsProps |. selectedResourcePathGet,
    ~selectResource=jsProps |. selectResourceGet,
    ~loadFromFile=jsProps |. loadFromFileGet,
    ~removeResource=jsProps |. removeResourceGet,
    [||]
));

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