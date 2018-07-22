type resourceListAction =
  | RemoveResource(string)
  /* media.LoadSourceDoneAction: add new resource to the list once video loaded */
  | LoadSourceDone(string, string, string, option(int))
  /* media.LoadSourceAction: add new source fron file */
  | LoadSourceFromFile(string, string, string)
  | SetVisibility(bool);

module Decode = {
  open Json.Decode;
  
  let resourceListAction = json => switch(json |> field("type", string)){
  | "remove_resource" => Some(RemoveResource(json |> field("resourcePath", string)))
  | "load_source_done" => Some(LoadSourceDone(
    json |> field("sourceType", string), 
    json |> field("sourceIdentifier", string), 
    json |> field("elementId", string), 
    json |> optional(field("duration", int))))
  | "load_source" => Some(LoadSourceFromFile(
    json |> field("sourceType", string),
    json |> field("sourceIdentifier", string),
    json |> field("elementId", string)
    ))
  | "set_resource_list_visibility" => Some(SetVisibility(
    json |> field("visibility", bool)
    ))
  | _ => None
  };
};

module Encode = {
  open Json.Encode;

  let resourceListAction = action => switch(action){
  | RemoveResource(resourcePath) => object_([
    ("type", string("remove_resource")),
    ("resourcePath", string(resourcePath))
  ])
  | LoadSourceDone(sourceType, sourceIdentifier, elementId, duration) => object_([
    ("type", string("load_source_done")),
    ("sourceType", string(sourceType)),
    ("sourceIdentifier", string(sourceIdentifier)),
    ("elementId", string(elementId)),
    ("duration", nullable(int, duration))
  ]) 
  | LoadSourceFromFile(sourceType, sourceIdentifier, elementId) => object_([
    ("type", string("load_source")),
    ("sourceType", string(sourceType)),
    ("sourceIdentifier", string(sourceIdentifier)),
    ("elementId", string(elementId))
  ])
  | SetVisibility(visibility) => object_([
    ("type", string("set_resource_list_visibility")),
    ("visibility", bool(visibility))
  ])
  }
};

let toJs = action => action |> Encode.resourceListAction;
let fromJs = js => js |> Decode.resourceListAction;