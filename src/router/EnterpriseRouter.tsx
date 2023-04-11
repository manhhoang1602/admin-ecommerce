import React from 'react'
import Dashboard from '../modules/dashboad/Dashboard'
import { Route, Switch } from 'react-router-dom'

export const ENTERPRISE_ROUTER = {
  DASHBOARD: {
    path: '/dashboard',
    component: Dashboard,
  },
}

const EnterpriseRouter = () => {
  let arrEnterpriseRouter = Object.values(ENTERPRISE_ROUTER)
  return (
    <Switch>
      {arrEnterpriseRouter.map((value) => (
        <Route exact path={value.path} component={value.component} />
      ))}
    </Switch>
  )
}

export default EnterpriseRouter
