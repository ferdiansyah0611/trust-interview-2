import users from './users'
import { createStore, combineReducers } from 'redux'

var reducers = combineReducers({
	users: users
})

export default createStore(reducers)