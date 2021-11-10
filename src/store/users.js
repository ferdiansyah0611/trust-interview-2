var initial = {
	users: []
}

var seeduser = (id, name, nip, telp, email) => {
	initial.users.push({id: id, name: name, nip: nip, telp: telp, email: email})
}

seeduser(1, 'Fadhila Muhammad', '200208012018081001', '085966253416', 'fadhila@protonmail.com')
seeduser(2, 'Ferdiansyah', '200208012018081002', '085966253417', 'ferdiansyah@protonmail.com')
seeduser(3, 'Galuh Subroto', '200208012018081003', '085966253418', 'galuh@protonmail.com')
seeduser(4, 'Kevin Sentosa', '200208012018081004', '085966253419', 'kevin@protonmail.com')
seeduser(5, 'Yoanda', '200208012018081005', '085966253420', 'yoanda@protonmail.com')

const users = (state = initial, {data, type}) => {
	switch(type){
		// add data
		case "adduser":
			return{users: [...state.users, data]}
		// update user by id and assignment with var data
		case "updateuser":
			var updated = state.users.map((userData) => {
				if(userData.id === data.id){
					userData = data
					return userData
				}
				else{
					return userData
				}
			})
			return{users: updated}
		// remove user by id
		case "removeuser":
			return{users: state.users.filter((userDelete) => userDelete.id !== data)}
		// pagination a user
		case "paginateuser":
			var {older, newer} = data
			return{
				users: state.user.filter((userData, key) => key >= older && key <= newer)
			}
		default:
			return state
			break
	}
}

export default users