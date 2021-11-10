import React, {
	useState, useEffect
} from 'react'
import {
	useSelector, useDispatch
} from 'react-redux'
import {
	Button, IconButton, TextField, Grid,
	Dialog, DialogContent, DialogActions, AppBar, Toolbar, Typography,
	useMediaQuery, useTheme
} from '@mui/material'


var defaultData = {
		id: '', name: '', email: '', nip: '', telp: ''
}

export default function DialogAddOrEditUser(props){
	// mui
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
	// props component
	const { detail, isedit, open, onClose} = props
	// redux users
	const redux = useSelector(state => state.users)
	// dispatching hook redux
	const dispatch = useDispatch()
	// state
	const [data, setdata] = useState(defaultData)
	const state = React.useMemo(() => {
		return data
	}, [data])
	// watch
	useEffect(() => {
		if(detail){
			setdata(detail)
		}else{
			setdata(defaultData)
		}
	}, [detail])
	// action
	const validate = (success) => {
		var isValidate = []
		Object.keys(data || {}).forEach((found, key) => {
			if(found !== 'id' && data[found].length >= 3){
				isValidate.push(true)
			}
			if(key === (Object.keys(data || {}).length - 1)){
				if(isValidate.length === (Object.keys(data || {}).length - 1)){
					success()
				}
			}
		})
	}
	const addUser = () => {
		var last = redux.users[redux.users.length - 1]
		if(last){
			validate(() => {
				dispatch({
					type: 'adduser',
					data: Object.assign(
						data,
						{id: Number(last.id) + 1}
					)
				})
				onClose()
				setdata(defaultData)
			})
		}
	}
	const updateUser = () => {
		validate(() => {
			dispatch({type: 'updateuser', data: data})
			onClose()
		})
	}
	const handleinput = (e) => setdata({...data, [e.target.name]: e.target.value})
	const submit = (e) => {
		e.preventDefault()
		isedit ? updateUser(): addUser()
	}
	return(
		<form onSubmit={submit}>
		<Dialog fullScreen={fullScreen} maxWidth="sm" fullWidth open={open}>
			<AppBar position="static">
				<Toolbar>
					<Typography>{isedit ? 'Edit': 'Create'}</Typography>
				</Toolbar>
			</AppBar>
			<DialogContent>
				<Grid spacing={2} container>
					<Grid xs={12} md={6} item>
						<TextField required type="text" name="name" value={state.name} onChange={handleinput} fullWidth label="Name"/>
					</Grid>
					<Grid xs={12} md={6} item>
						<TextField required type="number" name="nip" value={state.nip} onChange={handleinput} fullWidth label="NIP"/>
					</Grid>
					<Grid xs={12} md={6} item>
						<TextField required type="tel" name="telp" value={state.telp} onChange={handleinput} fullWidth label="No. Telp"/>
					</Grid>
					<Grid xs={12} md={6} item>
						<TextField required type="email" name="email" value={state.email} onChange={handleinput} fullWidth label="Email"/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button color="secondary" onClick={onClose}>Close</Button>
				<Button type="submit" color="primary" onClick={submit}>Save</Button>
			</DialogActions>
		</Dialog>
		</form>
	)
}