import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Provider } from 'react-redux'
import store from './store'
import TableUser from './component/TableUser'
import {
  AppBar, Typography, Toolbar, Container,
  Paper, Box
} from '@mui/material'


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <AppBar>
          <Toolbar>
            <Typography>Interview 2</Typography>
          </Toolbar>
        </AppBar>
        <Container style={{marginTop: '80px', marginBottom: '80px'}}>
          <TableUser/>
        </Container>
      </Provider>
    </div>
  )
}

export default App
