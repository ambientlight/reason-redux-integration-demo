[@bs.deriving jsConverter]
type align = [
  | [@bs.as "inherit"] `Inherit
  | [@bs.as "left"] `Left
  | [@bs.as "center"] `Center
  | [@bs.as "right"] `Right
  | [@bs.as "justify"] `Justify
];

[@bs.deriving jsConverter]
type color = [
  | [@bs.as "inherit"] `Inherit
  | [@bs.as "primary"] `Primary
  | [@bs.as "textSecondary"] `TextSecondary
  | [@bs.as "secondary"] `Secondary
  | [@bs.as "error"] `Error
  | [@bs.as "default"] `Default
];

[@bs.deriving jsConverter]
type variant = [
  | [@bs.as "display4"] `Display4
  | [@bs.as "display3"] `Display3
  | [@bs.as "display2"] `Display2
  | [@bs.as "display1"] `Display1
  | [@bs.as "headline"] `Headline
  | [@bs.as "title"] `Title
  | [@bs.as "subheading"] `Subheading
  | [@bs.as "body2"] `Body2
  | [@bs.as "body1"] `Body1
  | [@bs.as "caption"] `Caption
  | [@bs.as "button"] `Button
];

module Classes = {
  type classesType =
    | Root(string)
    | Display4(string)
    | Display3(string)
    | Display2(string)
    | Display1(string)
    | Headline(string)
    | Title(string)
    | Subheading(string)
    | Body2(string)
    | Body1(string)
    | Caption(string)
    | Button(string)
    | AlignLeft(string)
    | AlignCenter(string)
    | AlignRight(string)
    | AlignJustify(string)
    | NoWrap(string)
    | GutterBottom(string)
    | Paragraph(string)
    | ColorInherit(string)
    | ColorPrimary(string)
    | ColorSecondary(string)
    | ColorTextSecondary(string)
    | ColorError(string);
  type t = list(classesType);
  let to_string =
    fun
    | Root(_) => "root"
    | Display4(_) => "display4"
    | Display3(_) => "display3"
    | Display2(_) => "display2"
    | Display1(_) => "display1"
    | Headline(_) => "headline"
    | Title(_) => "title"
    | Subheading(_) => "subheading"
    | Body2(_) => "body2"
    | Body1(_) => "body1"
    | Caption(_) => "caption"
    | Button(_) => "button"
    | AlignLeft(_) => "alignLeft"
    | AlignCenter(_) => "alignCenter"
    | AlignRight(_) => "alignRight"
    | AlignJustify(_) => "alignJustify"
    | NoWrap(_) => "noWrap"
    | GutterBottom(_) => "gutterBottom"
    | Paragraph(_) => "paragraph"
    | ColorInherit(_) => "colorInherit"
    | ColorPrimary(_) => "colorPrimary"
    | ColorSecondary(_) => "colorSecondary"
    | ColorTextSecondary(_) => "colorTextSecondary"
    | ColorError(_) => "colorError";
  let to_obj = listOfClasses =>
    listOfClasses
    |. Belt.List.reduce(
         Js.Dict.empty(),
         (obj, classType) => {
           switch (classType) {
           | Root(className)
           | Display4(className)
           | Display3(className)
           | Display2(className)
           | Display1(className)
           | Headline(className)
           | Title(className)
           | Subheading(className)
           | Body2(className)
           | Body1(className)
           | Caption(className)
           | Button(className)
           | AlignLeft(className)
           | AlignCenter(className)
           | AlignRight(className)
           | AlignJustify(className)
           | NoWrap(className)
           | GutterBottom(className)
           | Paragraph(className)
           | ColorInherit(className)
           | ColorPrimary(className)
           | ColorSecondary(className)
           | ColorTextSecondary(className)
           | ColorError(className) =>
             Js.Dict.set(obj, to_string(classType), className)
           };
           obj;
         },
       );
};

[@bs.obj]
external makeProps :
  (
    ~align: string=?,
    ~className: string=?,
    ~color: string=?,
    ~component: 'union_rbff=?,
    ~gutterBottom: bool=?,
    ~headlineMapping: Js.t({..})=?,
    ~noWrap: bool=?,
    ~paragraph: bool=?,
    ~variant: string=?,
    ~classes: Js.Dict.t(string)=?,
    ~style: ReactDOMRe.Style.t=?,
    unit
  ) =>
  _ =
  "";
[@bs.module "@material-ui/core/Typography/Typography"]
external reactClass : ReasonReact.reactClass = "default";
let make =
    (
      ~align: option(align)=?,
      ~className: option(string)=?,
      ~color: option(color)=?,
      ~component:
         option(
           [
             | `String(string)
             | `Callback('genericCallback)
             | `ObjectGeneric(Js.t({..}))
           ],
         )=?,
      ~gutterBottom: option(bool)=?,
      ~headlineMapping: option(Js.t({..}))=?,
      ~noWrap: option(bool)=?,
      ~paragraph: option(bool)=?,
      ~variant: option(variant)=?,
      ~classes: option(Classes.t)=?,
      ~style: option(ReactDOMRe.Style.t)=?,
      children,
    ) =>
  ReasonReact.wrapJsForReason(
    ~reactClass,
    ~props=
      makeProps(
        ~align=?align |. Belt.Option.map(v => alignToJs(v)),
        ~className?,
        ~color=?color |. Belt.Option.map(v => colorToJs(v)),
        ~component=?
          component |. Belt.Option.map(v => MaterialUi_Helpers.unwrapValue(v)),
        ~gutterBottom?,
        ~headlineMapping?,
        ~noWrap?,
        ~paragraph?,
        ~variant=?variant |. Belt.Option.map(v => variantToJs(v)),
        ~classes=?Belt.Option.map(classes, v => Classes.to_obj(v)),
        ~style?,
        (),
      ),
    children,
  );
