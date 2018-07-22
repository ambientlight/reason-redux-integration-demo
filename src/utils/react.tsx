import * as React from 'react' 
import * as createReactClass from 'create-react-class'

interface MountedProps {
    didMount: () => void
}

export function Mounted<P>(Component: React.StatelessComponent<P & MountedProps>){
    return createReactClass<P & MountedProps, {}>({
        componentDidMount() {
            this.props.didMount();
        },
        render() {
            return <Component {...this.props} />
        }
    })
}