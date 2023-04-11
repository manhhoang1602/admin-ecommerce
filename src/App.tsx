import React from 'react'
import './App.scss'
import Login from './modules/login/Login'
import LayoutComponent from './modules/layout/LayoutComponent'
import { Route, Router, Switch } from 'react-router-dom'
import history from './services/history'

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path={'/'} component={Login} />
        <Route component={LayoutComponent} />
      </Switch>
    </Router>
  )
}

export default App
