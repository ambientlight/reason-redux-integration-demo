[@bs.deriving jsConverter]
type color = [
  | [@bs.as "primary"] `Primary
  | [@bs.as "secondary"] `Secondary
  | [@bs.as "inherit"] `Inherit
];

[@bs.deriving jsConverter]
type variant = [
  | [@bs.as "determinate"] `Determinate
  | [@bs.as "indeterminate"] `Indeterminate
  | [@bs.as "static"] `Static
];

module Classes = {
  type classesType =
    | Root(string)
    | Static(string)
    | Indeterminate(string)
    | ColorPrimary(string)
    | ColorSecondary(string)
    | Svg(string)
    | Circle(string)
    | CircleStatic(string)
    | CircleIndeterminate(string);
  type t = list(classesType);
  let to_string =
    fun
    | Root(_) => "root"
    | Static(_) => "static"
    | Indeterminate(_) => "indeterminate"
    | ColorPrimary(_) => "colorPrimary"
    | ColorSecondary(_) => "colorSecondary"
    | Svg(_) => "svg"
    | Circle(_) => "circle"
    | CircleStatic(_) => "circleStatic"
    | CircleIndeterminate(_) => "circleIndeterminate";
  let to_obj = listOfClasses =>
    listOfClasses
    |. Belt.List.reduce(
         Js.Dict.empty(),
         (obj, classType) => {
           switch (classType) {
           | Root(className)
           | Static(className)
           | Indeterminate(className)
           | ColorPrimary(className)
           | ColorSecondary(className)
           | Svg(className)
           | Circle(className)
           | CircleStatic(className)
           | CircleIndeterminate(className) =>
             Js.Dict.set(obj, to_string(classType), className)
           };
           obj;
         },
       );
};

[@bs.obj]
external makeProps :
  (
    ~className: string=?,
    ~color: string=?,
    ~size: 'union_rjxy=?,
    ~thickness: 'number_j=?,
    ~value: 'number_c=?,
    ~variant: string=?,
    ~classes: Js.Dict.t(string)=?,
    ~style: ReactDOMRe.Style.t=?,
    unit
  ) =>
  _ =
  "";
[@bs.module "@material-ui/core/CircularProgress/CircularProgress"]
external reactClass : ReasonReact.reactClass = "default";
let make =
    (
      ~className: option(string)=?,
      ~color: option(color)=?,
      ~size: option([ | `Int(int) | `Float(float) | `String(string)])=?,
      ~thickness: option([ | `Int(int) | `Float(float)])=?,
      ~value: option([ | `Int(int) | `Float(float)])=?,
      ~variant: option(variant)=?,
      ~classes: option(Classes.t)=?,
      ~style: option(ReactDOMRe.Style.t)=?,
      children,
    ) =>
  ReasonReact.wrapJsForReason(
    ~reactClass,
    ~props=
      makeProps(
        ~className?,
        ~color=?color |. Belt.Option.map(v => colorToJs(v)),
        ~size=?
          size |. Belt.Option.map(v => MaterialUi_Helpers.unwrapValue(v)),
        ~thickness=?
          thickness |. Belt.Option.map(v => MaterialUi_Helpers.unwrapValue(v)),
        ~value=?
          value |. Belt.Option.map(v => MaterialUi_Helpers.unwrapValue(v)),
        ~variant=?variant |. Belt.Option.map(v => variantToJs(v)),
        ~classes=?Belt.Option.map(classes, v => Classes.to_obj(v)),
        ~style?,
        (),
      ),
    children,
  );
