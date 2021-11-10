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


var initdata = {
		name: '', email: '', nip: '', telp: ''
}
var defaultData = Object.assign({...initdata}, {id: ''})
var dataValidate = {
	name: {min: 2, max: 20},
	email: {regexp: /\S+@\S+\.\S+$/},
	nip: {min: 17},
	telp: {min: 11}
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
	const [onError, seterror] = useState({
		name: '', email: '', nip: '', telp: ''
	})
	const state = React.useMemo(() => {
		return data
	}, [data])
	// watch
	useEffect(() => {
		seterror(initdata)
		if(detail){
			setdata(detail)
		}else{
			setdata(defaultData)
		}
	}, [detail])
	// action
	const validate = (success) => {
		var isValidate = []
		Object.keys(dataValidate || {}).forEach((name, key) => {
			if(dataValidate[name].min && !(data[name].length >= dataValidate[name].min)){
				isValidate.push(true)
				seterror({...onError, [name]: name + ' must be have min ' + dataValidate[name].min + ' length'})
				// console.log(name)
			}
			if(dataValidate[name].max && !(data[name].length <= dataValidate[name].max)){
				isValidate.push(true)
				seterror({...onError, [name]: name + ' must be have max ' + dataValidate[name].max + ' length'})
				// console.log(name)
			}
			if(dataValidate[name].regexp && !data[name].match(dataValidate[name].regexp)){
				isValidate.push(true)
				seterror({...onError, [name]: name + ' must be email validation'})
			}
			else if(key === (Object.keys(dataValidate || {}).length - 1)){
				if(isValidate.length === 0){
					success()
				}
			}
		})
	}
	const addUser = () => {
		var last = redux.users[redux.users.length - 1],
		assign = Object.assign(
			data,
			{id: Number(last ? last.id: 0) + 1}
		)
		validate(() => {
			dispatch({
				type: 'adduser',
				data: assign
			})
			onClose()
			setdata(defaultData)
		})
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
						<TextField helperText={onError.name} required type="text" name="name" value={state.name} onChange={handleinput} fullWidth label="Name"/>
					</Grid>
					<Grid xs={12} md={6} item>
						<TextField helperText={onError.nip} required type="number" name="nip" value={state.nip} onChange={handleinput} fullWidth label="NIP"/>
					</Grid>
					<Grid xs={12} md={6} item>
						<TextField helperText={onError.telp} required type="tel" name="telp" value={state.telp} onChange={handleinput} fullWidth label="No. Telp"/>
					</Grid>
					<Grid xs={12} md={6} item>
						<TextField helperText={onError.email} required type="email" name="email" value={state.email} onChange={handleinput} fullWidth label="Email"/>
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