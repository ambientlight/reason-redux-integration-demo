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