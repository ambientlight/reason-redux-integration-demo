type mapStateToProps('state, 'props, 'connectedStateProps) = (. 'state, 'props) => 'connectedStateProps;
type mapDispatchToProps('action, 'props, 'connectedDispatchProps) = (. (. 'action) => unit, 'props) => 'connectedDispatchProps;

[@bs.module "react-redux"] 
external connect: (
  mapStateToProps('state, 'props, 'connectedStateProps), 
  mapDispatchToProps('action, 'props, 'connectedDispatchProps)
) => (. ReasonReact.reactClass) => ReasonReact.reactClass = "connect";