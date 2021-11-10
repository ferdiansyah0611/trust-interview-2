import {
	Button,
	Dialog, DialogContent, DialogActions, AppBar, Toolbar, Typography,
	DialogTitle, DialogContentText
} from '@mui/material'

export default function DialogConfirm({open, onClose, onDelete}){
	return(
		<Dialog open={open} maxWidth="sm">
			<DialogTitle>Confirmation</DialogTitle>
			<DialogContent>
				<DialogContentText>Do you want delete this data?</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary">cancel</Button>
				<Button onClick={onDelete} color="primary">yes</Button>
			</DialogActions>
		</Dialog>
	)
}