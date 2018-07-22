[@bs.deriving jsConverter]
type placement = [
  | [@bs.as "bottom-end"] `Bottom_End
  | [@bs.as "bottom-start"] `Bottom_Start
  | [@bs.as "bottom"] `Bottom
  | [@bs.as "left-end"] `Left_End
  | [@bs.as "left-start"] `Left_Start
  | [@bs.as "left"] `Left
  | [@bs.as "right-end"] `Right_End
  | [@bs.as "right-start"] `Right_Start
  | [@bs.as "right"] `Right
  | [@bs.as "top-end"] `Top_End
  | [@bs.as "top-start"] `Top_Start
  | [@bs.as "top"] `Top
];
[@bs.obj]
external makeProps :
  (
    ~anchorEl: 'union_r3lm=?,
    ~container: 'union_r9up=?,
    ~disablePortal: bool=?,
    ~keepMounted: bool=?,
    ~modifiers: Js.t({..})=?,
    ~_open: bool,
    ~placement: string=?,
    ~popperOptions: Js.t({..})=?,
    ~theme: Js.t({..})=?,
    ~transition: bool=?,
    unit
  ) =>
  _ =
  "";
[@bs.module "@material-ui/core/Popper/Popper"]
external reactClass : ReasonReact.reactClass = "default";
let make =
    (
      ~anchorEl:
         option(
           [ | `ObjectGeneric(Js.t({..})) | `Callback('genericCallback)],
         )=?,
      ~container:
         option(
           [ | `ObjectGeneric(Js.t({..})) | `Callback('genericCallback)],
         )=?,
      ~disablePortal: option(bool)=?,
      ~keepMounted: option(bool)=?,
      ~modifiers: option(Js.t({..}))=?,
      ~open_: bool,
      ~placement: option(placement)=?,
      ~popperOptions: option(Js.t({..}))=?,
      ~theme: option(Js.t({..}))=?,
      ~transition: option(bool)=?,
      children,
    ) =>
  ReasonReact.wrapJsForReason(
    ~reactClass,
    ~props=
      makeProps(
        ~anchorEl=?
          anchorEl |. Belt.Option.map(v => MaterialUi_Helpers.unwrapValue(v)),
        ~container=?
          container |. Belt.Option.map(v => MaterialUi_Helpers.unwrapValue(v)),
        ~disablePortal?,
        ~keepMounted?,
        ~modifiers?,
        ~_open=open_,
        ~placement=?placement |. Belt.Option.map(v => placementToJs(v)),
        ~popperOptions?,
        ~theme?,
        ~transition?,
        (),
      ),
    children,
  );
