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