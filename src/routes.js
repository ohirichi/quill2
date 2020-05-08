import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Login, Story, Write, Read, AddOrEditStory, AddOrEditChapter, Chapter, Test} from './components'
import {me} from './store'


//#region ProtectedRoute Component

const ProtectedRoute = ({component:Component, auth, ...restOfProps}) =>{
  console.log("auth:" , auth)
    return(
        <Route
          render={ routeProps => (
            auth ? <Component {...routeProps}{...restOfProps}/>:<Login />)}
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
            <Route exact path="/">
                {/* To Do: Homepage Component */}
                <Read/>
            </Route>
            <Route exact path="/read">
                {/* To Do: All Stories Component */}
                <Read />
            </Route>
            <Route exact path="/read/:storyId/:chapterNumber">
                <Chapter mode="read"/>
            </Route>
            <Route exact path="/read/:storyId">
                <Story mode="read"/>
            </Route>
            <Route exact path="/login">
                <Login/>
            </Route>
            <Route exact path="/write">
                {/* To Do: Writing Dashboard Component or CTA to Login/Register if no user logged in */}
                <Write />
            </Route>
            <Route exact path="/write/new">
              {/* To Do: Convert to protected route */}
                <AddOrEditStory mode="add"/>
            </Route>   
            <Route exact path="/write/:storyId/addChapter">
              {/* To Do: Convert to protected route */}
                <AddOrEditChapter mode="add"/>
            </Route>
            <Route exact path="/edit/:storyId/:chapterNum">
              {/* To Do: Convert to protected route and add component */} 
              <AddOrEditChapter mode="edit"/>
            </Route>
            <Route exact path="/edit/:storyId">
              {/* To Do: Convert to protected route and add component */} 
              <AddOrEditStory mode="edit"/>
            </Route>
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


