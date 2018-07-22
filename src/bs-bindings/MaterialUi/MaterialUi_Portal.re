[@bs.obj]
external makeProps :
  (
    ~container: 'union_rpgl=?,
    ~disablePortal: bool=?,
    ~onRendered: ReactEventRe.Synthetic.t => unit=?,
    unit
  ) =>
  _ =
  "";
[@bs.module "@material-ui/core/Portal/Portal"]
external reactClass : ReasonReact.reactClass = "default";
let make =
    (
      ~container:
         option(
           [ | `ObjectGeneric(Js.t({..})) | `Callback('genericCallback)],
         )=?,
      ~disablePortal: option(bool)=?,
      ~onRendered: option(ReactEventRe.Synthetic.t => unit)=?,
      children,
    ) =>
  ReasonReact.wrapJsForReason(
    ~reactClass,
    ~props=
      makeProps(
        ~container=?
          container |. Belt.Option.map(v => MaterialUi_Helpers.unwrapValue(v)),
        ~disablePortal?,
        ~onRendered?,
        (),
      ),
    children,
  );
