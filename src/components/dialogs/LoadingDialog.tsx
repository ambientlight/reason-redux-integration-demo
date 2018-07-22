import * as React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress'

export interface MediaLoadingDialogProps {
    open: boolean
}
  
export const LoadingDialog = (props: MediaLoadingDialogProps): JSX.Element => (
    <Dialog
        open={props.open}
        keepMounted
        onClose={this.handleClose}>

        <DialogContent>
            <CircularProgress variant="indeterminate" size={128} color="secondary" />
        </DialogContent>

    </Dialog>
)

export default LoadingDialog

