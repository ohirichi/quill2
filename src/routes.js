import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Login, AddStory, Test} from './components'
import {me} from './store'


//#region ProtectedRoute Component

const ProtectedRoute = ({component:Component, isLoggedIn, ...restOfProps}) =>{
    return(
        <Route
          render={ routeProps => (
            isLoggedIn ? <Component {...routeProps}{...restOfProps}/>:<Redirect to="/login"/>)}
        />        
    )
}

//#endregion

//#region Routes Component

const Routes = (props)=> {
    const {isLoggedIn} = props
    useEffect(() => props.loadInitialData())
  
    return(
        <Switch>
            <Route path="/login">
                <Login/>
            </Route>
            <Route path="/write">
                <AddStory/>
            </Route>
            <Route
            path="/hello"
            render={(props)=>(<div>Hello There</div>)}
            />
            <ProtectedRoute path="/test" isLoggedIn={isLoggedIn} component={Test} />
            <Route>
                <Login/>
            </Route>
        </Switch>
    )
}

//#endregion

//#region MapState and MapDispatch

const mapState = state => {
    return {
      // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
      // Otherwise, state.user will be an empty object, and state.user.id will be falsey
      isLoggedIn: !!state.user.id,
      userId: state.user.id
    }
  }
  
  const mapDispatch = dispatch => {
    return {
      loadInitialData() {
        dispatch(me())
      }
    }
  }

  //#endregion

  // The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))


