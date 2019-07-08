import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

const Home = lazy(() => import('./Home'))
const User = lazy(() => import('./User'))

const App = () => (
  <Router>
    <Suspense fallback={<div>...</div>}>
      <Switch>
        <Route path="/home" component={Home}/>
        <Route path="/user" component={User}/>
        <Redirect to="/home" />
      </Switch>
    </Suspense>
  </Router>
)

render(
  <App />,
  document.getElementById('app')
)
