import React, {
	useState, useEffect, useReducer, useCallback
} from 'react'
import {
	useSelector, useDispatch
} from 'react-redux'
import {
	Button, IconButton, TextField, Grid, Paper,
	Table, TableContainer, TableCell, TableRow, TableHead, TableBody,
	Tooltip, Typography, Box,
	Select, MenuItem
} from '@mui/material'
// icon
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
// component
import DialogAddOrEditUser from './DialogAddOrEditUser'
import DialogConfirm from './DialogConfirm'

// toolkits
var isIndex = (search, objectName) => {
	return objectName.toLowerCase().indexOf(search) !== -1
},
// filter user using indexOf
filteringUser = (search, users, paginate, setcount) => {
	var result = users.filter((userSearch) => {
		if(search){
			if((isIndex(search, userSearch.name) || isIndex(search, userSearch.nip) || isIndex(search, userSearch.email))){
				return userSearch
			}
		}
		else{
			return userSearch
		}
	})
	setcount(result.length)
	if(result.length >= paginate.row){
		// result = 
		result = result.slice(paginate.older, paginate.newest)
	}
	return result
}

export default function TabelUser(){
	// redux users
	const dispatch = useDispatch()
	const data = useSelector(state => state.users)
	// paginate state
	const [paginate, setpaginate] = useState({
		older: 0, newest: 5, page: 1, row: 5
	})
	// search state
	const [search, setsearch] = useState('')
	// clone state users from redux
	const [users, setusers] = useState([])
	const [count, setcount] = useState(0)
	const cacheuser = React.useMemo(() => users, [users])
	// reducer
	const [state, setstate] = useReducer((value, {type, payload}) => {
		switch(type){
			case "openEdit":
				return{...value, open: true, editData: payload, isedit: true}
				break
			case "openCreate":
				return{...value, open: true}
				break
			case "closed":
				return{...value, open: false, editData: null, isedit: false}
				break
			default:
				return value
		}
	}, {
		open: false,
		isedit: false,
		editData: null,
	})
	// confirmation delete user
	const [openConfirm, setOpenConfirm] = useState({id: null, open: false})
	const openedConfirm = useCallback((id) => setOpenConfirm({id: id, open: true}), [])
	const closedConfirm = () => setOpenConfirm({id: null, open: false})
	const confirmedDelete = () => {
		dispatch({type: 'removeuser', data: openConfirm.id})
		closedConfirm()
	}
	// watch paginate & count if page is more than max page, action to previous paginate
	useEffect(() => {
		if(paginate.page > Math.ceil(count / paginate.row)){
			previouspaginate()
		}
	}, [count, paginate])
	// watch paginate and change users data
	useEffect(() => {
		setusers(filteringUser(search, data.users, paginate, (sum) => setcount(sum)))
	}, [paginate, data.users])

	// action
	const nextpaginate = () => {
		// console.log(count, users.length, paginate)
		if(count > (paginate.row * paginate.page)){
			setpaginate({
				...paginate,
				older: paginate.older + paginate.row,
				newest: paginate.newest + paginate.row,
				page: paginate.page + 1
			})
		}
	}
	const previouspaginate = () => {
		if(paginate.page >= 2){
			setpaginate({
				...paginate,
				older: paginate.older - paginate.row,
				newest: paginate.newest - paginate.row,
				page: paginate.page - 1
			})
		}
	}
	const searchuser = (e) => {
		var value = e.target.value.toLowerCase()
		setsearch(value)

		if(value.length >= 1){
			setusers(
				filteringUser(value, data.users, paginate, (sum) => setcount(sum))
			)
			previouspaginate()
		}else{
			setusers(filteringUser('', data.users, paginate, (sum) => setcount(sum)))
		}
	}
	const ClickEdit = useCallback((data) => {
		setstate({type: 'openEdit', payload: data})
	}, [])
	
	return(
		<>
			<DialogAddOrEditUser
				open={state.open}
				isedit={state.isedit}
				detail={state.editData}
				onClose={() => setstate({type: 'closed'})}
			/>
			<DialogConfirm
				open={Boolean(openConfirm.open)}
				onDelete={confirmedDelete}
				onClose={closedConfirm}
			/>
			<Paper style={{marginBottom: 20}}>
				<Box p={2}>
					<div className="app_inputsearch">
						<Button color="primary" variant="contained" onClick={() => setstate({type: 'openCreate'})}>create</Button>
						<TextField
							style={{marginLeft: 10}}
							placeholder="Search by name, email, nip"
							size="small"
							fullWidth
							value={search}
							onChange={searchuser}
							type="text"
						/>
					</div>
				</Box>
			</Paper>
			<Grid spacing={2} container>
				<Grid xs={12} item>
					<TableContainer component={Paper}>
						<Table>
				      <TableHead>
				      	<TableRow>
					        <TableCell>ID</TableCell>
					        <TableCell>Name</TableCell>
					        <TableCell>Email</TableCell>
					        <TableCell>NIP</TableCell>
					        <TableCell>Phone</TableCell>
					        <TableCell>Action</TableCell>
				      	</TableRow>
				      </TableHead>
				      <TableBody>
				      {
				      	cacheuser.map((data, key) => (
				      		<TableRow key={key}>
				      			<TableCell>{data.id}</TableCell>
				      			<TableCell>{data.name}</TableCell>
				      			<TableCell>{data.email}</TableCell>
				      			<TableCell>{data.nip}</TableCell>
				      			<TableCell>{data.telp}</TableCell>
				      			<TableCell>
				      				<IconButton onClick={() => ClickEdit(data)}>
				      					<EditIcon/>
				      				</IconButton>
				      				<IconButton onClick={() => openedConfirm(data.id)} color="secondary">
				      					<DeleteIcon/>
				      				</IconButton>
				      			</TableCell>
				      		</TableRow>
				      	))
				      }
				      {
				      	cacheuser.length === 0 ?
				      	<TableRow>
				      		<TableCell>Empty</TableCell>
				      		<TableCell></TableCell>
				      		<TableCell></TableCell>
				      		<TableCell></TableCell>
				      		<TableCell></TableCell>
				      		<TableCell></TableCell>
				      	</TableRow>
				      	: false
				      }
				      </TableBody>
				    </Table>
					</TableContainer>
				</Grid>
				<Grid xs={12} item>
					<div className="app_inputsearch">
						<div>
							<Tooltip title="Previous">
								<IconButton size="medium" color="primary" onClick={previouspaginate}>
									<NavigateBeforeIcon/>
								</IconButton>
							</Tooltip>
							<Tooltip title="Next">
								<IconButton size="medium" color="primary" onClick={nextpaginate}>
									<NavigateNextIcon/>
								</IconButton>
							</Tooltip>
							<span style={{marginLeft: 10}}>Page {count === 0 ? 0: paginate.page}/{Math.ceil(count / paginate.row)}</span>
						</div>
					</div>
				</Grid>
			</Grid>
    </>
	)
}