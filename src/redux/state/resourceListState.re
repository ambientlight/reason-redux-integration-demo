[@bs.deriving abstract]
type state = {
    resourcePaths: list(string),
    visible: bool
};

let initial = () => state(
    ~resourcePaths=[],
    ~visible=false
);