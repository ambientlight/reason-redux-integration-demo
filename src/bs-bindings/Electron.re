open List

[@bs.deriving jsConverter]
type openDialogProperties = [
  | [@bs.as "openFile"] `OpenFile
  | [@bs.as "openDirectory"] `OpenDirectory
  | [@bs.as "multiSelections"] `MultiSelections
  | [@bs.as "showHiddenFiles"] `ShowHiddenFiles
  | [@bs.as "createDirectory"] `CreateDirectory
  | [@bs.as "noResolveAliases"] `NoResolveAliases
  | [@bs.as "treatPackageAsDirectory"] `TreatPackageAsDirectory
];


[@bs.deriving abstract]
type openDialogOptions = {
    properties: option(list(string))
};

[@bs.module "electron"][@bs.val][@bs.scope ("remote", "dialog")]
external _showOpenDialog: (openDialogOptions, list(string) => unit) => unit = "showOpenDialog";

let showOpenDialog = (properties: list(openDialogProperties), callback: list(string) => unit) =>
    _showOpenDialog(openDialogOptions(
        ~properties=Some(map(prop => prop |> openDialogPropertiesToJs, properties))
    ), callback);